import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

/** Covers the three checkout steps: information -> overview -> complete. */
export class CheckoutPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly errorMessage: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;
  readonly completeHeader: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.getByTestId('firstName');
    this.lastNameInput = page.getByTestId('lastName');
    this.postalCodeInput = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.errorMessage = page.getByTestId('error');
    this.subtotalLabel = page.getByTestId('subtotal-label');
    this.taxLabel = page.getByTestId('tax-label');
    this.totalLabel = page.getByTestId('total-label');
    this.finishButton = page.getByTestId('finish');
    this.completeHeader = page.getByTestId('complete-header');
  }

  async fillInformation(info: Partial<CustomerInfo>): Promise<void> {
    if (info.firstName !== undefined) await this.firstNameInput.fill(info.firstName);
    if (info.lastName !== undefined) await this.lastNameInput.fill(info.lastName);
    if (info.postalCode !== undefined) await this.postalCodeInput.fill(info.postalCode);
    await this.continueButton.click();
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }

  /** Extracts the numeric amount from labels like "Item total: $29.99". */
  static parseAmount(text: string): number {
    const match = text.match(/\$([\d.]+)/);
    if (!match) throw new Error(`No amount found in "${text}"`);
    return Number(match[1]);
  }
}
