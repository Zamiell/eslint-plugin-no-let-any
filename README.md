# eslint-plugin-no-let-any

## What is this?

This is a rule that disallows declaring variables with let that do not have a type. For example:

```ts
// Bad
let foo;

// Good
let foo: string;
```

This is useful because the `noImplicitAny` TypeScript compiler flag does not always catch this pattern. Declaring variables without the type can make code harder to read, especially if the variables are instantiated and declared far away from each other.

<br>

## How do I use it?

* `npm install --save-dev eslint-plugin-no-let-any`
* Add  `"plugin:no-let-any/recommended"` to the `extends` section of your `.eslintrc.js` file.

<br>

## What rules does this plugin provide?

It only provides one rule: `"no-let-any/no-let-any"`

<br>
