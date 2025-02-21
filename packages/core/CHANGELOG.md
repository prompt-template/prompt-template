# @prompt-template/core

## 0.11.0

### Minor Changes

- 413971d: Added static method to `walkInputVariables`

## 0.10.0

### Minor Changes

- 516c74c: Exposed `walkInputVariables` method and added multiple traversal strategies

## 0.9.0

### Minor Changes

- 555b5d3: Added `description` to `PromptTemplate` and `InputVariableConfig`

## 0.8.0

### Minor Changes

- 4480b17: Enabled `exactOptionalPropertyTypes` and updated types

## 0.7.0

### Minor Changes

- c33cee9: Allow passing `undefined` and `void` to `format` when all optional input values

## 0.6.0

### Minor Changes

- 2da2f7b: Allow empty object format input values

## 0.5.0

### Minor Changes

- 2bc1e66: Updated all input values to preserve indentation

## 0.4.0

### Minor Changes

- 0a99695: Updated nested `PromptTemplate` instances to preserve indentation

## 0.3.0

### Minor Changes

- 04cf1c1: Updated `PromptTemplate` and `ChatPromptTemplate` types

## 0.2.0

### Minor Changes

- ac3db41: Exposed utility types to support `@prompt-template` adapters and improved input variable validation

## 0.1.0

### Minor Changes

- a513f44: Added `accumulatedPrompt` argument to the input variable config `onFormat` callback

## 0.0.4

### Patch Changes

- 37fe119: Added static `PromptTemplate.from` method, updated `templateStrings` type from `TemplateStringsArray` to `PromptTemplateStrings`, and deprecated `promptTemplate` function
