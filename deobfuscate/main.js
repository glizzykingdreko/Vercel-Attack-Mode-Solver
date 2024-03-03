const fs = require('fs');
const parser = require('@babel/parser');
const generate = require('@babel/generator').default;
const traverse = require('@babel/traverse').default;
const vm = require('vm');
const t = require('@babel/types');

const code = fs.readFileSync('script.js', 'utf-8');

const ast = parser.parse(code, {});
const context = vm.createContext({});

let functionListName = null;
traverse(ast, {
    FunctionDeclaration(path) {
        if (
            3 === path.node.body.body.length &&
            t.isVariableDeclaration(path.node.body.body[0]) &&
            t.isExpressionStatement(path.node.body.body[1]) &&
            t.isReturnStatement(path.node.body.body[2]) &&
            path.node.body.body[2].argument.callee.name == path.node.id.name
        ) {
            functionListName = path.node.id.name;
            vm.runInContext(generate(path.node).code, context);
            path.remove();
        }
    }
});


let decryptFunctionName = null;
traverse(ast, {
    FunctionDeclaration(path) {
        if (
            path.node.body.body.length === 2 &&
            t.isVariableDeclaration(path.node.body.body[0]) &&
            t.isCallExpression(path.node.body.body[0].declarations[0].init) &&
            path.node.body.body[0].declarations[0].init.callee.name == functionListName
        ) {
            decryptFunctionName = path.node.id.name;
            vm.runInContext(generate(path.node).code, context);
            path.remove();
        }
    }
})

traverse(ast, {
    CallExpression(path) {
        if (
            t.isFunctionExpression(path.node.callee) &&
            2 === path.node.arguments.length &&
            t.isIdentifier(path.node.arguments[0]) &&
            path.node.arguments[0].name == functionListName
        ) {
            vm.runInContext("(" + generate(path.node).code + ")", context);
            path.remove();
        }
    }
});
traverse(ast, {
    CallExpression(path) {
        if (
            1 === path.node.arguments.length &&
            t.isNumericLiteral(path.node.arguments[0]) &&
            t.isIdentifier(path.node.callee) &&
            (path.node.callee.name.startsWith('_0') || path.node.callee.name.startsWith('a0'))
        ) {
            let result = vm.runInContext(`${decryptFunctionName}(${path.node.arguments[0].value})`, context);
            path.replaceWith(t.valueToNode(result));
        }
    }
});

let refs = new Set();
traverse(ast, {
    NumericLiteral(path) {
        // Clean number: transform hexadecimal to decimal
        if (path.node.extra && /^0[xX]/.test(path.node.extra.raw)) {
            path.replaceWith(t.numericLiteral(parseInt(path.node.extra.raw)));
        }
    },
    MemberExpression(path) {
        // Convert computed properties to dot notation when possible
        if (
            t.isStringLiteral(path.node.property) && // Ensure the property is a string literal
            path.node.computed && // Only target computed properties
            /^[a-zA-Z$_][a-zA-Z0-9$_]*$/.test(path.node.property.value) // Ensure the property name is a valid identifier
        ) {
            path.node.property = t.identifier(path.node.property.value);
            path.node.computed = false;
        }
    },
    VariableDeclarator(path) {
        // Remove variable declarations with no references
        if (
            t.isIdentifier(path.node.init) &&
            path.node.init.name === decryptFunctionName    
        ) {
            refs.add(path.node.id.name);
            path.remove();
        }
    }
})
traverse(ast, {
    VariableDeclarator(path) {
        // Remove unused variables
        if (
            t.isIdentifier(path.node.init) &&
            refs.has(path.node.init.name) 
        ) {
            path.remove();
        }
    }
})

const output = generate(ast).code;
fs.writeFileSync('out.js', output);