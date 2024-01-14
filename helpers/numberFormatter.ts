import { BigNumberish, formatUnits as _formatUnits, parseUnits as _parseUnits } from 'ethers';

export type FormatterConfig = Partial<{
  minFractionalLength: number;
  maxFractionalLength: number;
  thousandsStep: string;
  withTrailingDots: boolean;
}>;

const ZERO_VALUE = '0';
const DIVIDER = '.';

export class NumberFormatter {
  /**
   * @description convert decimal string number to bigint unit value
   * @example
   * parseUnits('1.123', 18); // 1123000000000000000n
   */
  static parseUnits(values: string, decimals: number): bigint {
    return _parseUnits(this.normalizeUserInput(values, decimals), decimals);
  }

  /**
   * @description convert unit string to decimal string number
   * @example
   * formatUnits('1123000000000000000', 18); // '1.123'
   */
  static formatUnits(value: BigNumberish, decimals: number): string {
    const intPart = this.toBigInt(String(value));

    return _formatUnits(intPart, decimals);
  }

  /**
   * @description convert unit string to bigint
   * @example
   * toBigInt('10000.00'); // 10000n
   */
  static toBigInt(value: string | number): bigint {
    const [intPart] = String(value).split('.');

    try {
      return BigInt(intPart);
    } catch {
      return BigInt(ZERO_VALUE);
    }
  }

  /**x
   * @example
   * const decimals = 18;
   * normalizeUserInput(' 1.32 ', decimals); // '1.32'
   * normalizeUserInput('0000000.320000000', decimals); // '0.32'
   * normalizeUserInput('any string', decimals); // '0'
   * // Fractional length is 19
   * normalizeUserInput('0.0000000000000000000000001', decimals); // '0'
   * normalizeUserInput('0.0000000000000000000000001'); // '0.0000000000000000000000001'
   */
  static normalizeUserInput(value: string, decimals?: number): string {
    const trimmedValue = value.trim();

    if (!Number(trimmedValue)) {
      return ZERO_VALUE;
    }

    const [decimal, frac] = trimmedValue.split(DIVIDER);
    const formattedDecimal = BigInt(decimal).toString();

    if (!frac) {
      return formattedDecimal;
    }

    if (!decimals || frac.length <= decimals) {
      return this.deleteTrailingZero(`${formattedDecimal}${DIVIDER}${frac}`);
    }

    const result = this.deleteTrailingZero(`${formattedDecimal}${DIVIDER}${frac.slice(0, decimals)}`);

    return !Number(result) ? ZERO_VALUE : result;
  }

  private static deleteTrailingZero(input: string): string {
    const [int, fract] = input.split(DIVIDER);

    if (!fract || !Number(fract)) return int;

    let result = fract;

    while (result[result.length - 1] === '0') {
      result = result.slice(0, -1);
    }

    return `${int}${DIVIDER}${result}`;
  }

  /**
   * @description Format string number to display
   * @example
   * format('1'); // '1.00'
   * format('1000.1234567890'); // '1 000.123456'
   * format('1000.12300000001', { withTrailingDots: true  }); // '1 000.123000...'
   */
  static formatToDisplay(value: string, config: FormatterConfig = {}): string {
    const { minFractionalLength, maxFractionalLength, thousandsStep, withTrailingDots } = {
      minFractionalLength: 2,
      maxFractionalLength: 6,
      thousandsStep: ' ',
      withTrailingDots: false,
      ...config,
    };

    const [int, frac] = this.normalizeUserInput(value).split(DIVIDER);
    const formattedInt = thousandsStep !== undefined ? int.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsStep) : int;

    if (!frac || !Number(frac)) {
      return minFractionalLength ? `${formattedInt}${DIVIDER}${ZERO_VALUE.repeat(minFractionalLength)}` : formattedInt;
    }

    const slicedFrac = frac.slice(0, maxFractionalLength);

    if (slicedFrac.length < minFractionalLength) {
      return `${formattedInt}${DIVIDER}${slicedFrac.padEnd(minFractionalLength, ZERO_VALUE)}`;
    }

    if (frac.length > slicedFrac.length && withTrailingDots) {
      return `${formattedInt}${DIVIDER}${slicedFrac}...`;
    }

    return `${formattedInt}${DIVIDER}${slicedFrac}`;
  }

  /**
   * @description convert unit string to formatted decimal string
   * @example
   * formatUnitsToDisplay({
   *   value: '1123000000000000000000',
   *   decimals: 18,
   * }); // '1 000.123'
   */
  static formatUnitsToDisplay(
    value: BigNumberish,
    { decimals, ...config }: { decimals: number } & FormatterConfig
  ): string {
    return this.formatToDisplay(this.formatUnits(value, decimals), {
      maxFractionalLength: decimals,
      ...config,
    });
  }
}

export class ApiNumberFormatter extends NumberFormatter {
  static readonly DECIMALS = 2;

  /**
   * @description `parseUnits` with 18 decimal places.
   * @example
   * parseUnits('1.123'); // 1123000000000000000n
   */
  static parseUnits(values: string): bigint {
    return super.parseUnits(values, this.DECIMALS);
  }

  /**
   * @description `formatUnits` with 18 decimal places.
   * @example
   * formatUnits('1123000000000000000'); // '1.123'
   */
  static formatUnits(value: BigNumberish): string {
    return super.formatUnits(value, this.DECIMALS);
  }

  static formatToDisplay(value: string, config: FormatterConfig = {}): string {
    return super.formatToDisplay(value, { maxFractionalLength: this.DECIMALS, ...config });
  }

  static formatUnitsToDisplay(value: BigNumberish, config: FormatterConfig = {}): string {
    return super.formatUnitsToDisplay(value, {
      decimals: this.DECIMALS,
      ...config,
    });
  }
}
