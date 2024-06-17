import { expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

export abstract class BasePage {
  constructor(public readonly page: Page) {}

  abstract goto(): Promise<void>;

  async isNuxtHydrated() {
    return await this.page.waitForFunction(
      () => window?.useNuxtApp?.().isHydrating === false
    );
  }

  async expectPageToBeAccessible({
    disableRules = [],
  }: { disableRules?: string[] } = {}) {
    const { violations } = await new AxeBuilder({ page: this.page })
      .disableRules(disableRules)
      .analyze();
    const formattedViolations = violations.map(
      ({ help, helpUrl, id, impact, nodes }) => ({
        rule: id,
        help: `${impact?.toUpperCase() || "-"}: ${help} (${helpUrl})`,
        nodes,
      })
    );

    expect(formattedViolations).toEqual([]);
  }
}
