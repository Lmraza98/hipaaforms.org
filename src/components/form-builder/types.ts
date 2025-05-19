import type { FormApi, AnyFieldApi, FormValidateOrFn, FormAsyncValidateOrFn } from '@tanstack/react-form';
import type { StyleProps } from '@/utils/tw';

export type FormValues = Record<string, unknown>;

export type ValidatorFn<TValue = unknown> = (params: { value: TValue }) => string | undefined | Promise<string | undefined>;

export interface BaseFieldDefinition {
  id: string;
  label: string;
  placeholder?: string;
  isSystemGenerated?: boolean;
  // Generic validators property
  validatorsConfig?: {
    required?: boolean;
    // other generic validator configs like minLength, pattern etc. can go here
    // Field-specific validators will be part of their specific definitions or handled by their modules
  };
}

export interface ShortTextFieldDefinition extends BaseFieldDefinition, StyleProps {
  type: 'ShortText';
  /** HTML autocomplete hint – maps to native `autocomplete` attribute. Defaults to 'off'. */
  autocompleteAttr?: 'off' | 'name' | 'username' | 'email' | 'organization-title';

  /** Minimum allowed character length */
  minLength?: number;
  /** Maximum allowed character length */
  maxLength?: number;

  /** Custom RegExp pattern the value must satisfy */
  regexPattern?: string;
  /** Whether regex matching is case-sensitive. Defaults to false (= ignore case). */
  regexCaseSensitive?: boolean;

  /** Tailwind width utility, defaults to w-full */
  width?: string;
}

/**
 * Email field definition – supports browser autofill, domain restrictions and
 * shared style props used throughout the form-builder.
 */
export interface EmailFieldDefinition extends BaseFieldDefinition, StyleProps {
  /** Field discriminator */
  type: 'Email';

  /**
   * Preferred HTML `autocomplete` token. Defaults to `'email'`.
   * – `'email'`    → user's email address autofill
   * – `'username'` → login/username autofill (occasionally useful)
   * – `'off'`      → disable browser autofill completely
   */
  autocompleteAttr?: 'email' | 'username' | 'off';

  /**
   * Optional white-list of domains allowed for submission.
   * E.g. `[ 'acme.com', 'partner.org' ]`
   */
  allowedDomains?: string[];

  /** Tailwind width utility (e.g. `w-full`, `w-1/2`). Defaults to `w-full`. */
  width?: string;
}

export interface LongTextFieldDefinition extends BaseFieldDefinition, StyleProps {
  type: 'LongText';
  /** Number of textarea rows visible. Defaults to 3. */
  rows?: number;

  /** Minimum allowed character length */
  minLength?: number;
  /** Maximum allowed character length */
  maxLength?: number;

  /** Custom RegExp pattern the value must satisfy */
  regexPattern?: string;
  /** Whether regex matching is case-sensitive. Defaults to false (= ignore case). */
  regexCaseSensitive?: boolean;

  /** HTML autocomplete hint – maps to native `autocomplete` attribute. Defaults to 'off'. */
  autocompleteAttr?: 'off' | 'street-address' | 'on';

  /** Tailwind width utility, defaults to w-full */
  width?: string;
}

export interface FullNameFieldDefinition extends BaseFieldDefinition, StyleProps {
  type: 'FullName';

  /**
   * Determines how the full name should be captured.
   *  - `single`   → one input for the entire name (default)
   *  - `split`    → two inputs: first & last name
   *  - `firstOnly`→ only the first-name input is shown
   */
  nameLayout?: 'single' | 'split' | 'firstOnly';

  /** Placeholder text for the first-name input. Used when `nameLayout` is not `single`. */
  firstPlaceholder?: string;
  /** Placeholder text for the last-name input. Used when `nameLayout` is `split`. */
  lastPlaceholder?: string;

  /*** Validation props ***/
  /** Minimum character length */
  minLength?: number;
  /** Maximum character length */
  maxLength?: number;
  /** Restrict to alphabetic characters */
  onlyAlphabetic?: boolean;
  /** Allow a single-letter middle initial (e.g. "John D.") when onlyAlphabetic is true */
  allowMiddleInitial?: boolean;
  /** Custom RegExp pattern (string) to validate the input. */
  customRegex?: string;
  /**
   * Preferred HTML autocomplete token for the (single or first-only) input.
   * When `nameLayout` is `split`, the component hard-codes the correct
   * `given-name` / `family-name` tokens for the two zones.
   *
   * The legacy `autocompleteAttr` prop is kept for backwards-compatibility and
   * will be ignored if `autocomplete` is provided.
   */
  autocomplete?: 'name' | 'given-name' | 'family-name' | 'off';
  /** @deprecated – use `autocomplete` instead */
  autocompleteAttr?: 'off' | 'name' | 'given-name' | 'family-name';

  /*** Layout ***/
  /** Tailwind width utility, defaults to w-full */
  width?: string;
}

export interface PhoneFieldDefinition extends BaseFieldDefinition {
  type: 'Phone';
}

export interface NumberFieldDefinition extends BaseFieldDefinition, StyleProps {
  type: 'Number';
  /** Placeholder text shown inside the input */
  placeholder?: string;
  /** Minimum numeric value allowed */
  min?: number;
  /** Maximum numeric value allowed */
  max?: number;
  /** Increment step. Defaults to 1 when allowDecimals === false and 'any' when true */
  step?: number;
  /** Allow decimal numbers. Defaults to false */
  allowDecimals?: boolean;
  /** Native browser autocomplete attribute */
  autocompleteAttr?: 'off' | 'cc-number' | 'tel-national';
  /** Tailwind width utility (e.g. w-full, w-1/2). Defaults to w-full. */
  width?: string;
}

export interface TimeFieldDefinition extends BaseFieldDefinition, StyleProps {
  type: 'Time';
  /** Placeholder text shown inside the input */
  placeholder?: string;
  /** Minimum allowed time in 24-hour HH:MM format */
  minTime?: string;              // 'HH:MM'
  /** Maximum allowed time in 24-hour HH:MM format */
  maxTime?: string;              // 'HH:MM'
  /** Minute granularity. 1 → 60-second step */
  stepMinutes?: number;          // default 1
  /** Display hint for form builders – native input always respects locale */
  format?: '24h' | '12h';        // UI hint only
  /** HTML autocomplete attribute */
  autocompleteAttr?: 'off' | 'bday' | 'birthdate';
  /** Tailwind width utility (e.g. w-full, w-1/2). Defaults to w-full. */
  width?: string;
}

export interface FillInTheBlankFieldDefinition extends BaseFieldDefinition, StyleProps {
  type: 'FillInTheBlank';

  /** Marker token that indicates a blank.  Default "___". */
  blankMarker?: string;

  /** Optional list of correct answers, 1:1 with blanks. */
  answers?: string[]; // leave undefined for "free text"

  /** Whether answer comparison is case-sensitive.  Default false. */
  caseSensitive?: boolean;
}

export interface ParagraphFieldDefinition
  extends Omit<BaseFieldDefinition, 'placeholder' | 'validatorsConfig'>,
    StyleProps {
  type: 'Paragraph';
  /** Paragraph text content */
  content: string;

  /** Tailwind width utility (e.g. w-full, w-1/2). Defaults to w-full. */
  width?: string;
  
  /**
   * Text color expressed as a Tailwind utility (e.g. 'gray-900', 'blue-500').
   */
  textColor?: string;
}

export interface DatePickerFieldDefinition extends BaseFieldDefinition {
  type: 'DatePicker';
}

export interface DropdownFieldDefinition extends BaseFieldDefinition, StyleProps {
  type: 'Dropdown';
  /**
   * Array of option objects. If `label` is omitted, the UI should display the `value` string.
   * Example: [{ value: 'CA', label: 'California' }, { value: 'NY' }]
   */
  options?: { value: string; label?: string }[];
  /** Text shown when nothing is selected (single-select only). */
  placeholder?: string;
  /** Allow selecting multiple options. */
  allowMultiple?: boolean;
  /** Allow user to type a custom option (tags-style). */
  allowCustom?: boolean;
  /** Minimum selections when allowMultiple is true. */
  minSelections?: number;
  /** Maximum selections when allowMultiple is true. */
  maxSelections?: number;
  /** HTML autocomplete hint – maps to native `autocomplete` attribute. Defaults to 'off'. */
  autocompleteAttr?: 'off' | 'country' | 'bday-month';
  /** Tailwind width utility, defaults to w-full */
  width?: string;
}

export interface HeadingFieldDefinition extends Omit<BaseFieldDefinition, 'placeholder' | 'validatorsConfig'> {
  type: 'Heading';
  level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  subheading?: string;
  /**
   * Horizontal text alignment for the heading & sub-heading. Maps to Tailwind classes
   * text-left | text-center | text-right
   */
  alignment?: 'left' | 'center' | 'right';

  /**
   * Optional expression describing when this heading should be displayed.
   * Implementation of the expression engine is out of scope for the field-def
   * – it will be interpreted by higher-level form-runtime logic.
   * Example: "form.age > 18"
   */
  visibilityCondition?: string;

  /**
   * Tailwind size token (e.g. '2xl', '4xl'). Defaults to '2xl'.
   */
  fontSize?: string;

  /**
   * Tailwind font-weight token (e.g. 'normal', 'medium', 'semibold', 'bold').
   * Defaults to 'semibold'.
   */
  fontWeight?: 'thin' | 'extralight' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';

  /**
   * Text colour expressed as a Tailwind utility (e.g. 'gray-900', 'blue-500').
   */
  textColor?: string;

  /**
   * Margin utility classes to apply to the heading wrapper (e.g. 'my-4').
   */
  margin?: string;

  /**
   * Padding utility classes to apply to the heading wrapper (e.g. 'py-2').
   */
  padding?: string;
  // Label is used as the heading text.
}

export interface SubmitButtonFieldDefinition
  extends Omit<BaseFieldDefinition, 'placeholder' | 'validatorsConfig'>,
    StyleProps {
  type: 'SubmitButton';
  /** Text shown inside the button – defaults to the field label or "Submit" */
  buttonText?: string;

  /** Visual style variant */
  variant?: 'primary' | 'secondary' | 'outline' | 'link';

  /** Padding / font size preset */
  size?: 'sm' | 'md' | 'lg';

  /** Button width utility. Defaults to 'full' (w-full). */
  width?: 'auto' | 'full';

  /** Disable interaction */
  isDisabled?: boolean;

  /** Advanced: completely override Tailwind classes */
  customClasses?: string;
}

export interface AddressFieldDefinition extends BaseFieldDefinition, StyleProps {
  type: 'Address';

  /**
   * Determines how the address should be captured.
   *  - `single` → one input for the full street-address (default)
   *  - `split`  → four inputs: street, city, state, ZIP/Postal Code
   */
  addressLayout?: 'single' | 'split';

  /** Placeholder shown for the street input when layout is `split`. */
  streetPlaceholder?: string;
  /** Placeholder shown for the city input when layout is `split`. */
  cityPlaceholder?: string;
  /** Placeholder shown for the state/region input when layout is `split`. */
  statePlaceholder?: string;
  /** Placeholder shown for the ZIP / postal-code input when layout is `split`. */
  zipPlaceholder?: string;

  /**
   * Pattern used to validate the ZIP / postal-code.
   *  - `US`     → 5 digits or ZIP+4
   *  - `CA`     → Canadian postal-code pattern
   *  - `custom` → Use `customZipRegex`
   */
  zipPattern?: 'US' | 'CA' | 'custom';
  /** Custom RegExp pattern (string) for ZIP validation when `zipPattern` === 'custom'. */
  customZipRegex?: string;

  /** Tailwind width utility, defaults to w-full */
  width?: string;
}

export interface AppointmentFieldDefinition extends BaseFieldDefinition, StyleProps {
  type: 'Appointment';

  /** Determines which native input(s) to render. Defaults to 'datetime'. */
  appointmentLayout?: 'datetime' | 'dateOnly' | 'timeOnly';

  /** Minimum allowed date – ISO yyyy-mm-dd string. Ignored when layout === 'timeOnly'. */
  minDate?: string;
  /** Maximum allowed date – ISO yyyy-mm-dd string. Ignored when layout === 'timeOnly'. */
  maxDate?: string;

  /** Minimum allowed time in 24-hour HH:MM format. Ignored when layout === 'dateOnly'. */
  minTime?: string;
  /** Maximum allowed time in 24-hour HH:MM format. Ignored when layout === 'dateOnly'. */
  maxTime?: string;

  /** Minute granularity for time or datetime inputs. 15 → quarter-hour increments. */
  stepMinutes?: number;

  /** HTML autocomplete token providing browser hints. Defaults to 'off'. */
  autocompleteAttr?: 'off' | 'bday' | 'bday-month';

  /** Tailwind width utility (e.g. w-full, w-1/2). Defaults to w-full. */
  width?: string;
}

export interface SignatureFieldDefinition extends BaseFieldDefinition, StyleProps {
  type: 'Signature';
  /** canvas height in pixels */
  canvasHeight?: number;          // default 160
  /** drawing line thickness (px) */
  strokeWidth?: number;           // default 2
  /** drawing color */
  strokeColor?: string;           // default '#000000'
  /** background color */
  backgroundColor?: string;       // default '#ffffff'
  /** export format */
  exportFormat?: 'png' | 'jpeg';  // default 'png'
}

export interface SingleChoiceFieldDefinition extends BaseFieldDefinition, StyleProps {
  type: 'SingleChoice';
  /** option objects; if `label` omitted, UI should display `value` */
  options: { value: string; label?: string }[];
  /** display options vertically (default) or horizontally */
  orientation?: 'vertical' | 'horizontal';
  /** randomize option order at runtime */
  shuffleOptions?: boolean;
  /** browser autocomplete hint */
  autocompleteAttr?: 'off' | 'sex' | 'honorific-prefix';
}

export interface MultiChoiceFieldDefinition extends BaseFieldDefinition, StyleProps {
  type: 'MultiChoice';
  /** array of option objects; if `label` omitted, use `value` */
  options: { value: string; label?: string }[];
  /** display options vertically (default) or horizontally */
  orientation?: 'vertical' | 'horizontal';
  /** randomize order at runtime */
  shuffleOptions?: boolean;
  /** Minimum selections required */
  minSelections?: number;
  /** Maximum selections allowed */
  maxSelections?: number;
}

export interface ImageFieldDefinition extends Omit<BaseFieldDefinition, 'placeholder' | 'validatorsConfig'>, StyleProps {
  type: 'Image';

  /** Image source URL */
  src?: string;
  /** Alternative text for accessibility */
  alt?: string;

  /** CSS object-fit behaviour */
  fit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';

  /** Tailwind border radius utility (e.g. 'rounded-md', 'rounded-lg'). Defaults to 'rounded-md'. */
  borderRadius?: string;

  /** Tailwind border utility classes (e.g. 'border', 'border-2 border-gray-400'). Defaults to 'border border-gray-300'. */
  border?: string;

  /** Tailwind width utility (e.g. 'w-full', 'w-1/2'). Defaults to 'w-full'. */
  width?: string;

  /** Tailwind height utility (e.g. 'h-48'). Defaults to 'h-auto'. */
  height?: string;
}

export type FormFieldDefinition =
  | ShortTextFieldDefinition
  | EmailFieldDefinition
  | LongTextFieldDefinition
  | FullNameFieldDefinition
  | PhoneFieldDefinition
  | NumberFieldDefinition
  | TimeFieldDefinition
  | FillInTheBlankFieldDefinition
  | ParagraphFieldDefinition
  | DatePickerFieldDefinition
  | DropdownFieldDefinition
  | HeadingFieldDefinition
  | SubmitButtonFieldDefinition
  | AddressFieldDefinition
  | AppointmentFieldDefinition
  | SignatureFieldDefinition
  | SingleChoiceFieldDefinition
  | MultiChoiceFieldDefinition
  | ImageFieldDefinition;

export interface HeadingPreviewProps {
  fieldDef: HeadingFieldDefinition;
  onPropertyChange: (property: keyof HeadingFieldDefinition, value: unknown) => void;
}

export interface FieldCanvasProps {
  fields: FormFieldDefinition[];
  form: TypedFormApi<FormValues>;
  formName?: string;
  setFormName?: (name: string) => void;
  selectedFieldDef: FormFieldDefinition | null;
  dragOverIndex: number | null;
  handleDragOverList: (event: React.DragEvent<Element>, fieldListRefCurrent: HTMLDivElement | null) => void;
  handleDropOnList: (event: React.DragEvent<Element>) => void;
  handleDragStartFromList: (event: React.DragEvent<Element>, fieldDef: FormFieldDefinition, index: number) => void;
  handleDragEndList: (event: React.DragEvent<Element>) => void;
  handleFieldClick: (fieldDef: FormFieldDefinition) => void;
  removeField: (fieldId: string) => void;
  getFieldValidators: (fieldDef: FormFieldDefinition) => { onChange?: FieldValidator<unknown> };
  draggedItemId: string | null;
  setIsPropertiesOpen: (isOpen: boolean) => void;
  onPropertyChange: (propertyKey: string, value: unknown) => void;
}

/**
 * Validator signature for a single field value.
 */
export type FieldValidator<T> = (
  params: { value: T }
) => string | undefined | Promise<string | undefined>;

export interface FieldModule<
  TDef extends FormFieldDefinition = FormFieldDefinition
> {
  Preview: React.FC<{ fieldDef: TDef; fieldApi?: AnyFieldApi }>;
  Settings: React.FC<{
    fieldDef: TDef;
    onPropertyChange: (property: keyof TDef, value: unknown) => void;
  }>;
  /**
   * Return an object whose keys map to validator functions
   */
  getValidators?: (fieldDef: TDef) => {
    onChange?: FieldValidator<unknown>;
  };
  /**
   * Map this fieldDef to the backend schema's fieldType string
   */
  mapToSchemaType?: (fieldDef: TDef) => string;
}

export type FieldType = FormFieldDefinition['type'];

// 2) define a registry type
//    – keys are each FieldType (optional, so you can add modules over time)
//    – plus a mandatory Default entry
export type FieldRegistry = {
  [T in FieldType]?: FieldModule<Extract<FormFieldDefinition, { type: T }>>;
} & {
  Default: FieldModule<FormFieldDefinition>;
};

export interface FormBuilderContextValue {
  fields: FormFieldDefinition[];
  formName: string;
  setFormName: (name: string) => void;
  formDescription: string;
  setFormDescription: (description: string) => void;
  currentVersion: number;
  selectedFieldDef: FormFieldDefinition | null;
  setSelectedFieldDef: (field: FormFieldDefinition | null) => void;
  addField: (type: FormFieldDefinition['type'], label?: string, atIndex?: number) => void;
  removeField: (fieldId: string) => void;
  handlePropertyChange: (propertyKey: string, value: unknown) => void;
  saveForm: () => void;
  isSaving: boolean;
  isCreating: boolean;
  dragOverIndex: number | null;
  handleDragOverList: (event: React.DragEvent<Element>, fieldListRefCurrent: HTMLDivElement | null) => void;
  handleDropOnList: (event: React.DragEvent<Element>) => void;
  isPreviewMode: boolean;
  setIsPreviewMode: (on: boolean) => void;
  setFields: (newOrder: FormFieldDefinition[]) => void;
}

export interface FormBuilderProviderProps {
  formId: string;
  initialFieldsData: FormFieldDefinition[];
  initialName: string;
  initialDescription: string;
  initialVersion: number;
  userRole: string;
  children: React.ReactNode;
}

export type TypedFormApi<TValues extends object> = FormApi<
  TValues,
  FormValidateOrFn<TValues> | undefined,
  FormValidateOrFn<TValues> | undefined,
  FormAsyncValidateOrFn<TValues> | undefined,
  FormValidateOrFn<TValues> | undefined,
  FormAsyncValidateOrFn<TValues> | undefined,
  FormValidateOrFn<TValues> | undefined,
  FormAsyncValidateOrFn<TValues> | undefined,
  FormAsyncValidateOrFn<TValues> | undefined,
  unknown
>