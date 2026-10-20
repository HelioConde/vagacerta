const { test, expect } = require("@playwright/test");

function datePlus(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

test.beforeEach(async ({ page }) => {
  await page.route("https://cdn.jsdelivr.net/**", route => route.abort());
  await page.goto("/");
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload();
});

test("application flows through explained match, follow-up, resume and interview prep", async ({ page }) => {
  await page.getByRole("button", { name: "+ Nova candidatura" }).click();

  await page.locator('[name="company"]').fill("Empresa Aurora");
  await page.locator('[name="role"]').fill("Front-End Júnior");
  await page.locator('[name="status"]').selectOption("applied");
  await page.locator('[name="requirements"]').fill("+ React\n+ JavaScript\n- TypeScript\n? Inglês avançado");
  await expect(page.locator('[name="matchScore"]')).toHaveValue("67");
  await expect(page.locator("#match-breakdown")).toContainText("2 atendidos");
  await expect(page.locator("#match-breakdown")).toContainText("1 ausentes");

  await page.locator('[name="followUpAt"]').fill(datePlus(1));
  await page.locator('[name="interviewQuestions"]').fill("Conte um projeto difícil\nComo você consome APIs?");
  await page.locator('[name="interviewReview"]').fill("React hooks\nAPIs REST");
  await page.locator('[name="interviewNotes"]').fill("Reforçar comunicação do projeto principal.");
  await page.locator('[name="notes"]').fill("Enviar follow-up após revisar o portfólio.");
  await page.getByRole("button", { name: "Salvar candidatura" }).click();

  const card = page.locator(".job-card").filter({ hasText: "Empresa Aurora" });
  await expect(card).toBeVisible();
  await expect(card).toContainText("67% compatível");
  await expect(card).toContainText("2 atendidos");
  await expect(page.locator("#follow-up-list")).toContainText("Empresa Aurora");

  await card.getByRole("button", { name: "Currículos" }).click();
  await expect(page.locator("#documents-dialog")).toBeVisible();
  await page.locator('#document-form [name="title"]').fill("Front-End React — Aurora");
  await page.locator('#document-form [name="content"]').fill("Hélio Conde\nFront-End Developer\nReact, JavaScript, HTML, CSS");
  await page.getByRole("button", { name: "Salvar nova versão" }).click();
  await expect(page.locator("#document-list")).toContainText("Front-End React — Aurora");
  await page.locator("#documents-close").click();

  await card.locator("[data-edit]").click();
  await expect(page.locator('[name="interviewQuestions"]')).toHaveValue(/Conte um projeto difícil/);
  await expect(page.locator('[name="interviewReview"]')).toHaveValue(/React hooks/);
  await page.locator("#cancel-application").click();

  await page.locator('[data-status]').selectOption("interview");
  await expect(page.locator("#metric-interviews")).toHaveText("1");

  await page.locator("[data-follow-done]").click();
  await expect(page.locator("#follow-up-list")).not.toContainText("Empresa Aurora");
});

test("language switch translates the complete application and account flows", async ({ page }) => {
  await page.locator('[data-lang="en"]').click();

  await expect(page.getByRole("button", { name: "+ New application" })).toBeVisible();
  await expect(page.getByPlaceholder("Company, role or note")).toBeVisible();
  await expect(page.getByText("Where each opportunity stands")).toBeVisible();

  await page.getByRole("button", { name: "+ New application" }).click();
  await expect(page.getByText("Add opportunity")).toBeVisible();
  await expect(page.getByText("Company", { exact: true })).toBeVisible();
  await expect(page.getByText("Role", { exact: true })).toBeVisible();
  await expect(page.getByText("Salary / expectation")).toBeVisible();
  await expect(page.getByText("Requirement-by-requirement match")).toBeVisible();
  await expect(page.getByText("Interview preparation")).toBeVisible();
  await expect(page.getByRole("button", { name: "Save application" })).toBeVisible();
  await page.getByRole("button", { name: "Cancel" }).click();

  await expect(page.getByText("Follow-ups that need attention")).toBeVisible();

  await page.locator("#account-dialog").evaluate(dialog => dialog.showModal());
  await page.locator("#auth-form").evaluate(form => { form.hidden = false; });
  await expect(page.getByText("Sync your job search")).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign in", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Create account" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Forgot password" })).toBeVisible();
});


test("keyboard navigation and mobile layout remain accessible", async ({ page }) => {
  await page.keyboard.press("Tab");
  await expect(page.locator(".skip-link")).toBeFocused();
  await expect(page.locator(".skip-link")).toHaveText(/Pular para o conteúdo/);
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeInViewport();

  await page.getByRole("button", { name: "+ Nova candidatura" }).focus();
  const focusStyle = await page.getByRole("button", { name: "+ Nova candidatura" }).evaluate(element => {
    const style = getComputedStyle(element);
    return { outlineWidth: style.outlineWidth, boxShadow: style.boxShadow };
  });
  expect(focusStyle.outlineWidth !== "0px" || focusStyle.boxShadow !== "none").toBeTruthy();

  await page.getByRole("button", { name: "+ Nova candidatura" }).click();
  await expect(page.locator("#application-dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("#application-dialog")).not.toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator("body")).toBeVisible();

  const layout = await page.evaluate(() => ({
    bodyWidth: document.body.scrollWidth,
    viewportWidth: document.documentElement.clientWidth,
    tinyText: [...document.querySelectorAll("body *")]
      .filter(element => {
        const rect = element.getBoundingClientRect();
        if (!rect.width || !rect.height || !String(element.textContent || "").trim() || element.children.length) return false;
        return Number.parseFloat(getComputedStyle(element).fontSize) < 11;
      }).length,
    smallTargets: [...document.querySelectorAll("button,a,input,select,textarea")]
      .filter(element => {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
      })
      .filter(element => {
        const rect = element.getBoundingClientRect();
        return rect.width < 36 || rect.height < 36;
      }).length
  }));

  expect(layout.bodyWidth).toBeLessThanOrEqual(layout.viewportWidth);
  expect(layout.tinyText).toBe(0);
  expect(layout.smallTargets).toBe(0);
});


test("empty state guides first use and filters can be reset", async ({ page }) => {
  await expect(page.locator("#empty-dashboard")).toBeVisible();
  await expect(page.getByText("Organize sua próxima candidatura sem planilha.")).toBeVisible();
  await page.getByRole("button", { name: "Adicionar primeira candidatura" }).click();
  await expect(page.locator("#application-dialog")).toBeVisible();

  await page.locator('[name="company"]').fill("Empresa Teste");
  await page.locator('[name="role"]').fill("Produto");
  await page.getByRole("button", { name: "Salvar candidatura" }).click();

  await expect(page.locator("#empty-dashboard")).toBeHidden();
  await expect(page.locator("#board-summary")).toHaveText("1 candidatura exibida");

  await page.locator("#search").fill("não existe");
  await expect(page.locator("#board-summary")).toHaveText("0 candidaturas exibidas");
  await expect(page.getByRole("button", { name: "Limpar filtros" })).toBeVisible();

  await page.getByRole("button", { name: "Limpar filtros" }).click();
  await expect(page.locator("#search")).toHaveValue("");
  await expect(page.locator("#board-summary")).toHaveText("1 candidatura exibida");
});

test("mobile funnel navigation jumps between stages", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator("#board-nav")).toBeVisible();

  const interviewButton = page.locator('[data-column-jump="interview"]');
  await expect(interviewButton).toContainText("Entrevistas");
  await interviewButton.click();

  await expect(page.locator("#column-interview")).toBeFocused();
  const box = await page.locator("#column-interview").boundingBox();
  expect(box).not.toBeNull();
  expect(box.x).toBeGreaterThanOrEqual(-2);
  expect(box.x).toBeLessThan(390);
});
