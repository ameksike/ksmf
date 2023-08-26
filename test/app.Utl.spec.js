const KsMf = require('../index');
const utl = new KsMf.app.Utl();

describe('Utl', () => {

    describe('BOOLEAN', () => {
        it('asBoolean', () => {
            expect(utl.asBoolean(undefined)).toBe(false);
            expect(utl.asBoolean(null)).toBe(false);
            expect(utl.asBoolean("")).toBe(false);
            expect(utl.asBoolean(" ")).toBe(false);
            expect(utl.asBoolean(" false ")).toBe(false);
            expect(utl.asBoolean("false")).toBe(false);
            expect(utl.asBoolean("FALSE")).toBe(false);
            expect(utl.asBoolean("true")).toBe(true);
            expect(utl.asBoolean(" TRUE ")).toBe(true);
            expect(utl.asBoolean("oto")).toBe(true);
            expect(utl.asBoolean(1)).toBe(true);
            expect(utl.asBoolean(0)).toBe(false);
            expect(utl.asBoolean(true)).toBe(true);
            expect(utl.asBoolean(false)).toBe(false);
            expect(utl.asBoolean({}, false)).toBe(true);
            expect(utl.asBoolean([], false)).toBe(true);
        });

        it('asBoolean strict', () => {
            expect(utl.asBoolean({})).toBe(false);
            expect(utl.asBoolean({ a: 1 }, true)).toBe(true);
            expect(utl.asBoolean([], true)).toBe(false);
            expect(utl.asBoolean([1], true)).toBe(true);
        });
    });

    describe('STRING', () => {
        it('pad', () => {
            expect(utl.padSrt("")).toBe("");
            expect(utl.padSrt(" ")).toBe("");
            expect(utl.padSrt("1")).toBe("001");
            expect(utl.padSrt(1)).toBe("001");
            expect(utl.padSrt(11)).toBe("011");
            expect(utl.padSrt(111)).toBe("111");
            expect(utl.padSrt(1111)).toBe("1111");
            expect(utl.padSrt(1, 4)).toBe("0001");
            expect(utl.padSrt(1, 4, "-")).toBe("---1");
            expect(utl.padSrt()).toBe("");
            expect(utl.padSrt(undefined, 3, "-", null)).toBe(null);
        });

        it('replace all', () => {
            const obj = { elm: 1 };
            expect(utl.replace()).toBe(undefined);
            expect(utl.replace("")).toBe("");
            expect(utl.replace(".-.")).toBe(".-.");
            expect(utl.replace(".-.", "-")).toBe("..");
            expect(utl.replace(obj, "-", "")).toBe(obj);
            expect(utl.replace("ll.+.+.ll", ".", "-")).toBe("ll-+-+-ll");
            expect(utl.replace("ll.{+}.+.ll", "{", "-")).toBe("ll.-+}.+.ll");
            expect(utl.replace("ll.{+}.+.ll", /\{|\}/g, "-")).toBe("ll.-+-.+.ll");
        });

    });

    describe('NUMBER', () => {

        it('asNumberFormat', () => {
            const option = { separator: ",", decimals: "." };
            expect(utl.asNumberFormat("-555.737.084,902")).toBe("-555737084.902");
            expect(utl.asNumberFormat(-555737084.902)).toBe(-555737084.902);
            expect(utl.asNumberFormat("-555,737,084.902", option)).toBe("-555737084.902");
        });

        it('asNumber', () => {
            // numerical
            expect(utl.asNumber(0)).toBe(0);
            expect(utl.asNumber(10.4)).toBe(10.4);
            expect(utl.asNumber(1234)).toBe(1234);
            // with sign
            expect(utl.asNumber("1234")).toBe(1234);
            expect(utl.asNumber("-1234")).toBe(-1234);
            expect(utl.asNumber(-1234)).toBe(-1234);
            // wrong
            expect(utl.asNumber("de2")).toBe(null);
            expect(utl.asNumber()).toBe(null);
            // decimals separator           
            expect(utl.asNumber("10.400")).toBe(10400);
            expect(utl.asNumber("0,80")).toBe(0.80);
            expect(utl.asNumber("0.80")).toBe(80);
            expect(utl.asNumber("0.80", { decimals: ".", separator: "" })).toBe(0.8);
            expect(utl.asNumber("0.80", { separator: ".", decimals: ",", force: true })).toBe(0.8);
            expect(utl.asNumber("0.80", { force: true })).toBe(0.8);
            expect(utl.asNumber("0.8,1", { force: true })).toBe(8.1);
            // thousand separator
            expect(utl.asNumber(-555737084.902)).toBe(-555737084.902);
            expect(utl.asNumber("-555.737.084,902")).toBe(-555737084.902);
        });

        it('addNumberSeparator', () => {
            expect(utl.addNumberSeparator("1234567890")).toBe("1,234,567,890");
            expect(utl.addNumberSeparator("1234567.890")).toBe("1,234,567.890");
            expect(utl.addNumberSeparator("1234567.890", { window: 2, separator: " " })).toBe("1 23 45 67.890");
            expect(utl.addNumberSeparator(1234567.890)).toBe("1,234,567.89");
            expect(utl.addNumberSeparator(1.1)).toBe("1.1");
        });

        it('round', () => {
            expect(utl.round("ee49")).toBe(null);
            expect(utl.round("0,149")).toBe("0.149");
            expect(utl.round("0,149", 3)).toBe(0.149);
            expect(utl.round("0,149", { window: 3 })).toBe(0.149);
            expect(utl.round("0.149", { window: 0, decimals: ".", separator: "," })).toBe(0);
            expect(utl.round("0.149", { window: 1, force: true })).toBe(0.1);
            expect(utl.round("0.149", { window: 2, force: true })).toBe(0.15);
            expect(utl.round("0.149", { window: 2, format: String, force: true })).toBe("0.15");
            expect(utl.round("0.14946", { window: 4, format: String, force: true })).toBe("0.1495");
            expect(utl.round("14.009,46", { window: 1 })).toBe(14009.5);
            expect(utl.round("14.009,46", { window: 4 })).toBe(14009.46);
            expect(utl.round("14.009,46", { window: 4, format: String })).toBe("14009.4600");
            expect(utl.asNumber()).toBe(null);
        });

        it('delta', () => {
            expect(utl.getDelta(1234)).toBe(null);
            expect(utl.getDelta("", 1234)).toBe(null);
            expect(utl.getDelta("-", "-")).toBe(null);
            expect(utl.getDelta(null, null)).toBe(null);
            expect(utl.getDelta(undefined, null)).toBe(null);
            expect(utl.getDelta("1234", 1234)).toBe(0);
            expect(utl.getDelta(1234, 1234)).toBe(0);
            expect(utl.getDelta(1244, 1234)).toBe(10);
            expect(utl.getDelta(1234, 1244)).toBe(10);
            expect(utl.getDelta(1234, 1244, true)).toBe(-10);
        });


        it('get sign', () => {
            expect(utl.getSign()).toBe("");
            expect(utl.getSign("")).toBe("");
            expect(utl.getSign(0)).toBe("");
            expect(utl.getSign(-3)).toBe("-");
            expect(utl.getSign("-3")).toBe("-");
            expect(utl.getSign("-3", false)).toBe("");
            expect(utl.getSign(5, false)).toBe("+");
            expect(utl.getSign(5)).toBe("+");
        });
    });

    describe('ARRAY', () => {
        it('map a bad input', () => {
            expect(utl.asMap(1234)).toBe(undefined);
            expect(utl.asMap("12345")).toBe(undefined);
            expect(utl.asMap({ "name": "1" })).toBe(undefined);
            expect(utl.asMap()).toBe(undefined);
            expect(Object.values(utl.asMap([])).length).toBe(0);
        });

        it('map a simple array', () => {
            const source = ["first", "second", "third"];
            const result = utl.asMap(source);
            expect(typeof (result)).toBe("object");
            expect(result[0]).toBe(source[0]);
        });

        it('map an object list', () => {
            const source = [{ "name": "icao", "den": 123 }, { "name": "tsto", "den": 456 }];
            const result = utl.asMap(source, obj => obj.name, obj => obj.den);
            expect(typeof (result)).toBe("object");
            expect(result["icao"]).toBe(123);
            expect(result["tsto"]).toBe(456);
        });

        it('map an object by changing the keys', () => {
            const source = [{ "name": "icao", "den": 123 }, { "name": "tsto", "den": 456 }];
            const result = utl.asMap(source, (obj, lst, index) => {
                const left = lst[index - 1] && lst[index - 1].name;
                const right = lst[index + 1] && lst[index + 1].name;
                return (left || "-") + obj.name + (right || "-")
            }, obj => obj.den);
            expect(typeof (result)).toBe("object");
            expect(result["-icaotsto"]).toBe(123);
            expect(result["icaotsto-"]).toBe(456);
        });

        it('smart seach', () => {
            let map = {
                "75": "Dispatcher",
                "80": "Dispatcher2",
                "32": "Pilot",
                "99": "Specialist",
                "88": "Specialist",
                "98": "Specialist",
                "TI": "Specialist2",
                "TO": "Specialist2",
                "^(?!75|80|32|99|88|TI|TO).*$": "Guess"
            };

            expect(utl.search("75", map)).toBe("Dispatcher");
            expect(utl.search("80", map)).toBe("Dispatcher2");
            expect(utl.search("32", map)).toBe("Pilot");
            expect(utl.search("^(?!75|80|32|TI|TO).*$", map)).toBe("Specialist");
            expect(utl.search("T.*", map)).toBe("Specialist2");
            expect(utl.search("55", map)).toBe(false);
            expect(utl.search("77", map, { reverse: true })).toBe("Guess");
        });

        it('req extration default', () => {
            const req = { body: { sex: "", address: "1&2" }, params: { id: undefined }, query: { name: "tomy" }, age: "15" };
            const res = utl.getFrom(req);
            expect(res.sex).toBe(req.body.sex);
            expect(res.id).toBe(req.params.id);
            expect(res.name).toBe(req.query.name);
            expect(res.address).toBe(req.body.address);
            expect(res.age).toBe(undefined);
        });

        it('req extration clean', () => {
            const req = { sex: "", address: "1&2", age: "15", valid: "false", params: { id: undefined }, query: { name: "tomy" } };
            const res = utl.getFrom(req, { clean: true, key: { age: parseInt, valid: "Boolean" } });
            expect(res.sex).toBe(undefined);
            expect(res.id).toBe(undefined);
            expect(res.name).toBe(req.query.name);
            expect(res.address).toBe(req.address);
            expect(res.age).toBe(15);
            expect(res.valid).toBe(false);
        });

        it('req extration by key', () => {
            const req = { sex: "", address: "1&2", age: "15", valid: "false", params: { id: undefined }, query: { name: "tomy" } };
            const res = utl.getFrom(req, { key: "valid", type: "Boolean" });
            expect(res).toBe(false);
        });

        it('req extration by keys', () => {
            const req = { sex: "", address: "1&2", age: "15", time: "1,5", params: { id: undefined }, query: { name: "tomy" } };
            const res = utl.getFrom(req, { key: ["age", "time" ], type: "Number" });
            expect(res.age).toBe(15);
            expect(res.time).toBe(1.5);
        });
    });

    describe('POLYFILL', () => {
        it('ARRAY', () => {
            delete Array.prototype.at;
            utl.polyfill();
            expect([0, { items: [1, { elms: [2] }] }].at(-1).items.at(-1).elms.at(-1)).toBe(2);
            expect([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].at(-1)).toBe(9);
            expect([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].at(-2)).toBe(8);
            expect([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].at(8)).toBe(8);
            expect([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].at(0)).toBe(0);
        });

        it('STRING', () => {
            delete Array.prototype.replaceAll;
            utl.polyfill();
            expect("ll.+.+.ll".replaceAll(".", "-")).toBe("ll-+-+-ll");
            expect("ll.{+}.+.ll".replaceAll("{", "-")).toBe("ll.-+}.+.ll");
            expect("ll.{+}.+.ll".replaceAll(/\{|\}/g, "-")).toBe("ll.-+-.+.ll");
        });
    });
});