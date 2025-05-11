import * as DefaultField from './DefaultPreview';

export const getFieldModule = (type: string) => {
  console.log(`Requested field type: ${type}`);
  return DefaultField;
};

export * from '../form-builder/fields'; 