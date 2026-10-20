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

  await page.getByRole("button", { name: "Sign in / sync" }).click();
  await expect(page.getByText("Sync your job search")).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Create account" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Forgot password" })).toBeVisible();
});
