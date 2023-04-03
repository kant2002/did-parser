type TOKEN_TYPE = "IDENTIFIER" | "STRING" | "NUMBER" | "LPAREN" | "RPAREN"
    | "LBRACKET" | "RBRACKET"
    | "COMMA" | "EOF" | "NEWLINE" | "WHITESPACE" | "EQUALS";

interface TokenTypeData {
    name: TOKEN_TYPE;
    pattern: RegExp;
}

type ВузелЗначення = ЧисловийВузел | ЛогічнийВузел | ПустийВузел | ТекстовийВузел
    | ОбʼектнийВузел | ВузелСписка | ВузелСловника;

export class ЧисловийВузел {
    private _значення: number;
    constructor(значення: number) {
        this._значення = значення;
    }

    get значення() {
        return this._значення;
    }

    get value() {
        return this._значення;
    }
}

export class ЛогічнийВузел {
    private _значення: boolean;
    constructor(значення: boolean) {
        this._значення = значення;
    }

    get значення() {
        return this._значення;
    }

    get value() {
        return this._значення;
    }
}

export class ПустийВузел {
    constructor() {
    }

    static екземпляр = new ПустийВузел();
    static instance = ПустийВузел.екземпляр;
}

export class ТекстовийВузел {
    private _значення: string;
    constructor(значення: string) {
        this._значення = значення;
    }

    get значення() {
        return this._значення;
    }

    get value() {
        return this._значення;
    }
}

export class ВузелЗаписуОбʼекта {
    private _ключ: string;
    private _значення: ВузелЗначення;
    constructor(ключ: string, значення: ВузелЗначення) {
        this._ключ = ключ;
        this._значення = значення;
    }

    get ключ() {
        return this._ключ;
    }

    get key() {
        return this._ключ;
    }

    get значення() {
        return this._значення;
    }

    get value() {
        return this._значення;
    }
}

export class ОбʼектнийВузел {
    private _тип: string;
    private _елементи: ВузелЗаписуОбʼекта[];
    constructor(тип: string, елементи: ВузелЗаписуОбʼекта[]) {
        this._тип = тип;
        this._елементи = елементи;
    }

    get тип() {
        return this._тип;
    }

    get елементи() {
        return this._елементи;
    }

    get type() {
        return this._тип;
    }

    get elements() {
        return this._елементи;
    }
}

export class ВузелСписка {
    private _елементи: ВузелЗначення[];
    constructor(елементи: ВузелЗначення[]) {
        this._елементи = елементи;
    }

    get елементи() {
        return this._елементи;
    }

    get elements() {
        return this._елементи;
    }
}

export class ВузелЗаписуСловника {
    private _ключ: ТекстовийВузел | ЧисловийВузел;
    private _значення: ВузелЗначення;
    constructor(ключ: ТекстовийВузел | ЧисловийВузел, значення: ВузелЗначення) {
        this._ключ = ключ;
        this._значення = значення;
    }

    get ключ() {
        return this._ключ;
    }

    get key() {
        return this._ключ;
    }

    get значення() {
        return this._значення;
    }

    get value() {
        return this._значення;
    }
}

export class ВузелСловника {
    private _елементи: ВузелЗаписуСловника[];
    constructor(елементи: ВузелЗаписуСловника[]) {
        this._елементи = елементи;
    }

    get елементи() {
        return this._елементи;
    }

    get elements() {
        return this._елементи;
    }
}

export type NumberNode = ЧисловийВузел;
export type LogicalNode = ЛогічнийВузел;
export type EmptyNode = ПустийВузел;
export type TextNode = ТекстовийВузел;
export type ObjectNode = ОбʼектнийВузел;
export type ObjectEntryNode = ВузелЗаписуОбʼекта;
export type ListNode = ВузелСписка;
export type DictionaryNode = ВузелСловника;
export type DictionaryEntryNode = ВузелЗаписуСловника;

const TOKEN_TYPES: TokenTypeData[] = [
    { name: 'IDENTIFIER', pattern: /[a-zA-Zа-яА-ЯіҐʼ_][0-9a-zA-Zа-яА-ЯіҐʼ_]*/ },
    { name: 'EQUALS', pattern: /=/ },
    { name: 'STRING', pattern: /"[^"]*"/ },
    { name: 'NUMBER', pattern: /-?\d+(\.\d+)?/ },
    { name: 'LPAREN', pattern: /\(/ },
    { name: 'RPAREN', pattern: /\)/ },
    { name: 'LBRACKET', pattern: /\[/ },
    { name: 'RBRACKET', pattern: /\]/ },
    { name: 'COMMA', pattern: /,/ },
    { name: 'NEWLINE', pattern: /(\n|\r\n|\r)/ },
    { name: 'WHITESPACE', pattern: /\s+/ },
];

interface FilePosition {
    line: number;
    column: number;
}

interface FileRange {
    start: FilePosition;
    end: FilePosition;
}

class Token {
    constructor(public type: TOKEN_TYPE, public value: string, public range: FileRange) {
    }
}

export class Лексер {
    private position: number;
    private line: number = 1;
    private column: number = 1;

    constructor(public inputString: string) {
        this.position = 0;
    }

    getNextToken() {
        if (this.position >= this.inputString.length) {
            return new Token('EOF', null, {
                start: {
                    line: this.line,
                    column: this.column,
                },
                end: {
                    line: this.line,
                    column: this.column,
                }
            });
        }

        for (const tokenType of TOKEN_TYPES) {
            const regex = new RegExp(`^${tokenType.pattern.source}`);
            const match = this.inputString.slice(this.position).match(regex);

            if (match) {
                const value = match[0];
                const range = {
                    start: {
                        line: this.line,
                        column: this.column,
                    },
                    end: {
                        line: this.line,
                        column: value.length,
                    }
                }

                const token = new Token(tokenType.name, value, range);
                this.position += value.length;
                this.column += value.length;
                if (tokenType.name == "NEWLINE") {
                    this.line++;
                    this.column = 1;
                }

                return token;
            }
        }

        throw new Error(`Неочіковані дані на рядку: ${this.line} стовпець: ${this.column}: ${this.inputString.slice(this.position)}`);
    }
}

export class Парсер {
    private поточнийТокен: Token;
    constructor(private lexer: Лексер) {
        this.поточнийТокен = this.lexer.getNextToken();
    }

    поточнийТипТокену() {
        return this.поточнийТокен.type;
    }

    tryConsume(type: TOKEN_TYPE) {
        if (this.поточнийТокен.type === type) {
            // console.log(`Consume ${type}, ${this.поточнийТокен.value}`);
            this.поточнийТокен = this.lexer.getNextToken();
            return true;
        } else {
            return false;
        }
    }

    consume(type: TOKEN_TYPE, skipWhitespaces = true) {
        if (!this.tryConsume(type)) {
            throw new Error(`Unexpected token: ${this.поточнийТокен.type} (expected ${type})`);
        }

        if (skipWhitespaces) {
            while (this.tryConsume('WHITESPACE') || this.tryConsume('NEWLINE')) {
            }
        }
    }

    parse() {
        return this.parseValue();
    }

    parseBool() {
        if (this.поточнийТокен.type !== 'IDENTIFIER') {
            throw new Error(`Unexpected token: ${this.поточнийТокен.type}`);
        }

        if (this.поточнийТокен.value !== 'так' && this.поточнийТокен.value !== 'ні') {
            throw new Error(`Unexpected bool value, but ${this.поточнийТокен.value} was given`);
        }

        const значення = this.поточнийТокен.value === 'так';
        this.consume('IDENTIFIER');
        return new ЛогічнийВузел(значення);
    }

    parseValue(): ВузелЗначення {
        let propertyValue;
        if (this.поточнийТокен.type === 'STRING') {
            return this.parseTextNode();
        } else if (this.поточнийТокен.type === 'NUMBER') {
            return this.parseNumberNode();
        } else if (this.поточнийТокен.type === 'IDENTIFIER') {
            const identifier = this.поточнийТокен.value;
            if (identifier === 'так' || identifier === 'ні') {
                propertyValue = this.parseBool();
                if (this.поточнийТипТокену() === 'LPAREN') {
                    const елементи = this.parseObjectEntryNodes();
                    propertyValue = new ОбʼектнийВузел(identifier, елементи);    
                }
            }
            else if (identifier === 'пусто') {
                propertyValue = ПустийВузел.екземпляр;
                this.consume('IDENTIFIER');
                if (this.поточнийТипТокену() === 'LPAREN') {
                    const елементи = this.parseObjectEntryNodes();
                    propertyValue = new ОбʼектнийВузел(identifier, елементи);    
                }
            }
            else {
                this.consume('IDENTIFIER');
                const елементи = this.parseObjectEntryNodes();
                propertyValue = new ОбʼектнийВузел(identifier, елементи);
            }
        } else if (this.поточнийТокен.type === 'LBRACKET') {
            return this.parseList();
        } else if (this.поточнийТокен.type === 'LPAREN') {
            return this.parseDictionary();
        } else {
            throw new Error(`Неочікуваний токен: ${this.поточнийТокен.value} на рядку: ${this.поточнийТокен.range.start.line} стовпець: ${this.поточнийТокен.range.start.column}`);
        }

        return propertyValue;
    }

    private parseNumberNode() {
        const propertyValue = new ЧисловийВузел(parseFloat(this.поточнийТокен.value));
        this.consume(this.поточнийТокен.type);
        return propertyValue;
    }

    private parseTextNode() {
        const propertyValue = new ТекстовийВузел(this.поточнийТокен.value.slice(1, -1));
        this.consume(this.поточнийТокен.type);
        return propertyValue;
    }

    parseObject() {
        const typeName = this.поточнийТокен.value;
        this.consume('IDENTIFIER');
        const елементи = this.parseObjectEntryNodes();
        return new ОбʼектнийВузел(typeName, елементи);
    }

    private parseObjectEntryNodes() {
        this.consume('LPAREN');
        const елементи = [];

        while (this.поточнийТокен.type !== 'RPAREN') {
            const propertyName = this.поточнийТокен.value;
            this.consume('IDENTIFIER');
            this.consume('EQUALS');
            let propertyValue = this.parseValue();

            елементи.push(new ВузелЗаписуОбʼекта(propertyName, propertyValue));
            if (this.поточнийТокен.type === 'COMMA') {
                this.consume('COMMA');
            } else if (this.поточнийТипТокену() !== 'RPAREN') {
                throw new Error(`Очікувалася кома. На рядку ${this.поточнийТокен.range.start.line} стовпець ${this.поточнийТокен.range.start.column} знаходиься '${this.поточнийТокен.value}'`);
            }
        }

        this.consume('RPAREN');
        return елементи;
    }

    parseList() {
        this.consume('LBRACKET');
        const елементи = []

        while (this.поточнийТокен.type !== 'RBRACKET') {
            let значення = this.parseValue();
            елементи.push(значення)
            if (this.поточнийТокен.type === 'COMMA') {
                this.consume('COMMA');
            } else if (this.поточнийТипТокену() !== 'RBRACKET') {
                throw new Error(`Очікувалася кома. На рядку ${this.поточнийТокен.range.start.line} стовпець ${this.поточнийТокен.range.start.column} знаходиься '${this.поточнийТокен.value}'`);
            }
        }

        this.consume('RBRACKET');
        return new ВузелСписка(елементи);
    }

    parseDictionary() {
        this.consume('LPAREN');
        const елементи = []

        while (this.поточнийТокен.type !== 'RPAREN') {
            let propertyName: ТекстовийВузел | ЧисловийВузел;
            const tokenText = this.поточнийТокен.value;
            if (this.поточнийТокен.type === 'IDENTIFIER') {
                propertyName = new ТекстовийВузел(tokenText);
                this.consume('IDENTIFIER');
            } else if (this.поточнийТокен.type === 'STRING') {
                propertyName = this.parseTextNode();
            } else if (this.поточнийТокен.type === 'NUMBER') {
                propertyName = this.parseNumberNode();
            } else {
                throw new Error(`Очікувався ідентіфікатор, або строка або число. На рядку ${this.поточнийТокен.range.start.line} стотвпець ${this.поточнийТокен.range.start.line} знаходиься '${this.поточнийТокен.value}'`);
            }

            this.consume('EQUALS');
            let propertyValue = this.parseValue();

            елементи.push(new ВузелЗаписуСловника(propertyName, propertyValue))
            if (this.поточнийТипТокену() === 'COMMA') {
                this.consume('COMMA');
            } else if (this.поточнийТипТокену() !== 'RPAREN') {
                throw new Error(`Очікувалася кома. На рядку ${this.поточнийТокен.range.start.line} стовпець ${this.поточнийТокен.range.start.column} знаходиься '${this.поточнийТокен.value}'`);
            }
        }

        this.consume('RPAREN');
        return new ВузелСловника(елементи);
    }
}

export function розібрати(входнаСтрока: string) {
    const лексер = new Лексер(входнаСтрока);
    const парсер = new Парсер(лексер);
    return парсер.parse();
}

export function parse(inputString: string) {
    return розібрати(inputString);
}
