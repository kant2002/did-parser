type TOKEN_TYPE = "IDENTIFIER" | "STRING" | "NUMBER" | "LPAREN" | "COMMA" | "RPAREN" | "EOF" | "NEWLINE" | "WHITESPACE" | "EQUALS";
interface TokenTypeData {
    name: TOKEN_TYPE;
    pattern: RegExp;
}
const TOKEN_TYPES: TokenTypeData[] = [
    { name: 'IDENTIFIER', pattern: /[a-zA-Zа-яА-Яіʼ_][0-9a-zA-Zа-яА-Яіʼ_]+/u },
    { name: 'EQUALS', pattern: /=/ },
    { name: 'STRING', pattern: /"[^"]*"/ },
    { name: 'NUMBER', pattern: /\d+/ },
    { name: 'LPAREN', pattern: /\(/ },
    { name: 'RPAREN', pattern: /\)/ },
    { name: 'COMMA', pattern: /,/ },
    { name: 'NEWLINE', pattern: /\n/ },
    { name: 'WHITESPACE', pattern: /\s+/ },
];

class Token {
    constructor(public type: TOKEN_TYPE, public value: string) {
    }
}

class Lexer {
    private position: number;

    constructor(public inputString: string) {
        this.position = 0;
    }

    getNextToken() {
        if (this.position >= this.inputString.length) {
            return new Token('EOF', null);
        }

        for (const tokenType of TOKEN_TYPES) {
            const regex = new RegExp(`^${tokenType.pattern.source}`);
            const match = this.inputString.slice(this.position).match(regex);

            if (match) {
                const value = match[0];
                const token = new Token(tokenType.name, value);
                this.position += value.length;
                return token;
            }
        }

        throw new Error(`Invalid input at position ${this.position}: ${this.inputString.slice(this.position)}`);
    }
}

class Parser {
    private currentToken: Token;
    constructor(private lexer: Lexer) {
        this.currentToken = this.lexer.getNextToken();
    }

    tryConsume(type: TOKEN_TYPE) {
        if (this.currentToken.type === type) {
            //console.log(`Consume ${type}, ${this.currentToken.value}`);
            this.currentToken = this.lexer.getNextToken();
            return true;
        } else {
            return false;
        }
    }

    consume(type: TOKEN_TYPE, skipWhitespaces = true) {
        if (!this.tryConsume(type)) {
            throw new Error(`Unexpected token: ${this.currentToken.type} (expected ${type})`);
        }

        if (skipWhitespaces) {
            while (this.tryConsume('WHITESPACE') || this.tryConsume('NEWLINE')) {
            }
        }
    }

    parse() {
        const objectValue: any = {};
        const typeName = this.currentToken.value;
        this.consume('IDENTIFIER');
        this.consume('LPAREN');

        while (this.currentToken.type !== 'RPAREN') {
            const propertyName = this.currentToken.value;
            this.consume('IDENTIFIER');
            this.consume('EQUALS');
            let propertyValue = this.parseValue();

            objectValue[propertyName] = propertyValue;

            if (this.currentToken.type === 'COMMA') {
                this.consume('COMMA');
            }
        }

        this.consume('RPAREN');
        objectValue.$type = typeName;
        return objectValue;
    }

    parseBool() {
        if (this.currentToken.type !== 'IDENTIFIER') {
            throw new Error(`Unexpected token: ${this.currentToken.type}`);
        }

        if (this.currentToken.value !== 'так' && this.currentToken.value !== 'ні') {
            throw new Error(`Unexpected bool value, but ${this.currentToken.value} was given`);
        }

        this.consume('IDENTIFIER');
        return this.currentToken.value === 'так';
    }

    parseValue() {
        let propertyValue;
        if (this.currentToken.type === 'STRING' || this.currentToken.type === 'NUMBER') {
            propertyValue = this.currentToken.value.slice(1, -1);
            this.consume(this.currentToken.type);
        } else if (this.currentToken.type === 'IDENTIFIER') {
            if (this.currentToken.value !== 'так' && this.currentToken.value !== 'ні') {
                propertyValue = this.parse();
            }
            else {
                propertyValue = this.parseBool();
            }
        } else if (this.currentToken.type === 'LPAREN') {
            propertyValue = this.parseObject();
        } else if (this.currentToken.type === 'COMMA') {
            //propertyValue = this.parseObject();
        } else {
            throw new Error(`Unexpected token: ${this.currentToken.type}`);
        }

        return propertyValue;
    }

    parseObject() {
        this.consume('LPAREN');
        const object = this.parse();
        this.consume('RPAREN');
        return object;
    }
}

const lexer = new Lexer(`Паспорт(
    прізвище="Когут",
    імʼя="Давид",
    по_батькові="Богданович",
    дата_народження=Дата(
      день=20,
      місяць=1,
      рік=2001
    ),
    застарілий=ні
  )
`);
const parser = new Parser(lexer);
console.log(parser.parse());