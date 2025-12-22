import { test, expect } from "@playwright/test";

test("starter local dev loads successfully", async ({ page }) => {
  await page.goto("/location/location6");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Hello Pages Components"
  );
});
