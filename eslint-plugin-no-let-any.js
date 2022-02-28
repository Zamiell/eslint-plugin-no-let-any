"use strict";

module.exports = {
  configs: {
    recommended: {
      plugins: ["no-let-any"],

      rules: {
        "no-let-any/no-let-any": "warn",
      },
    },
  },

  rules: {
    "no-let-any": {
      create: noLetAny,

      meta: {
        type: "suggestion",

        docs: {
          description:
            "prevent declaring variables with let that do not have a type",
        },

        fixable: "code",
      },
    },
  },
};

function noLetAny(context) {
  if (
    !context.parserServices ||
    !context.parserServices.program ||
    !context.parserServices.esTreeNodeToTSNodeMap
  ) {
    /**
     * The user needs to have configured "project" in their parserOptions
     * for @typescript-eslint/parser
     */
    throw new Error(
      'You have used a rule which requires parserServices to be generated. You must therefore provide a value for the "parserOptions.project" property for @typescript-eslint/parser.'
    );
  }

  const typeChecker = context.parserServices.program.getTypeChecker();

  return {
    VariableDeclaration(node) {
      if (node.kind !== "let") {
        return;
      }

      for (const declaration of node.declarations) {
        // From: https://github.com/typescript-eslint/typescript-eslint/issues/781
        console.log(node);
        const typescriptNode =
          context.parserServices.esTreeNodeToTSNodeMap.get(declaration);

        // Skip declarations like:
        // let [, b] = myArray;
        // (situations like this will cause a runtime error in the "getTypeAtLocation" method below)
        if (!typescriptNode.symbol) {
          continue;
        }

        const type = typeChecker.getTypeAtLocation(typescriptNode);
        if (type.intrinsicName === "any") {
          context.report({
            node,
            message: "variables must be declared with a type",
          });
        }
      }
    },
  };
}
