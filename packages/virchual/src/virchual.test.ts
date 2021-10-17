import rewire from "rewire"
const virchual = rewire("@virchual/virchual")
const getSlideByIndex = virchual.__get__("getSlideByIndex")
// @ponicode
describe("getSlideByIndex", () => {
    test("0", () => {
        let callFunction: any = () => {
            getSlideByIndex(Infinity, [])
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("getSlides", () => {
    let inst: any

    beforeEach(() => {
        inst = new virchual.Virchual(document.querySelector("div:first-of-type"), {})
    })

    test("0", () => {
        let callFunction: any = () => {
            inst.getSlides(false)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            inst.getSlides(true)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("register", () => {
    let inst: any

    beforeEach(() => {
        inst = new virchual.Virchual(document.querySelector("div:first-of-type"), {})
    })

    test("0", () => {
        let callFunction: any = () => {
            inst.register({}, undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("mount", () => {
    let inst: any

    beforeEach(() => {
        inst = new virchual.Virchual(document.querySelector("div:first-of-type"), {})
    })

    test("0", () => {
        let callFunction: any = () => {
            inst.mount()
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("disable", () => {
    let inst: any

    beforeEach(() => {
        inst = new virchual.Virchual(document.querySelector("div:first-of-type"), {})
    })

    test("0", () => {
        let callFunction: any = () => {
            inst.disable()
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("enable", () => {
    let inst: any

    beforeEach(() => {
        inst = new virchual.Virchual(document.querySelector("span:first-of-type"), {})
    })

    test("0", () => {
        let callFunction: any = () => {
            inst.enable()
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("on", () => {
    let inst: any

    beforeEach(() => {
        inst = new virchual.Virchual(document.querySelector("canvas:first-of-type"), {})
    })

    test("0", () => {
        let callFunction: any = () => {
            inst.on("Anas", () => true)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            inst.on("Anas", () => "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            inst.on("George", () => "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            inst.on("Michael", () => "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            inst.on("", () => NaN)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("off", () => {
    let inst: any

    beforeEach(() => {
        inst = new virchual.Virchual(document.querySelector("canvas:first-of-type"), {})
    })

    test("0", () => {
        let callFunction: any = () => {
            inst.off("Edmond", () => false)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            inst.off("Edmond", () => "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            inst.off("George", () => "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            inst.off("Jean-Philippe", () => true)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            inst.off("George", () => false)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            inst.off("", () => Infinity)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("prev", () => {
    let inst: any

    beforeEach(() => {
        inst = new virchual.Virchual(document.querySelector("div:first-of-type"), {})
    })

    test("0", () => {
        let callFunction: any = () => {
            inst.prev()
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("next", () => {
    let inst: any

    beforeEach(() => {
        inst = new virchual.Virchual(document.querySelector("canvas:first-of-type"), {})
    })

    test("0", () => {
        let callFunction: any = () => {
            inst.next()
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("destroy", () => {
    let inst: any

    beforeEach(() => {
        inst = new virchual.Virchual(document.querySelector("span:first-of-type"), {})
    })

    test("0", () => {
        let callFunction: any = () => {
            inst.destroy()
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("_getImports", () => {
    let inst: any

    beforeEach(() => {
        inst = new virchual.Virchual(document.querySelector("div:first-of-type"), {})
    })

    test("0", () => {
        let callFunction: any = () => {
            inst._getImports()
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("_getSlidesLength", () => {
    let inst: any

    beforeEach(() => {
        inst = new virchual.Virchual(document.querySelector("canvas:first-of-type"), {})
    })

    test("0", () => {
        let callFunction: any = () => {
            inst._getSlidesLength(false)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            inst._getSlidesLength(true)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("_initSlides", () => {
    let inst: any

    beforeEach(() => {
        inst = new virchual.Virchual(document.querySelector("div:first-of-type"), {})
    })

    test("0", () => {
        let callFunction: any = () => {
            inst._initSlides()
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("_hydrate", () => {
    let inst: any

    beforeEach(() => {
        inst = new virchual.Virchual(document.querySelector("canvas:first-of-type"), {})
    })

    test("0", () => {
        let callFunction: any = () => {
            inst._hydrate()
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("_createClones", () => {
    let inst: any

    beforeEach(() => {
        inst = new virchual.Virchual(document.querySelector("span:first-of-type"), {})
    })

    test("0", () => {
        let callFunction: any = () => {
            inst._createClones()
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("_mountAndUnmountSlides", () => {
    let inst: any

    beforeEach(() => {
        inst = new virchual.Virchual(document.querySelector("div:first-of-type"), {})
    })

    test("0", () => {
        let callFunction: any = () => {
            inst._mountAndUnmountSlides(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("_bindEvents", () => {
    let inst: any

    beforeEach(() => {
        inst = new virchual.Virchual(document.querySelector("span:first-of-type"), {})
    })

    test("0", () => {
        let callFunction: any = () => {
            inst._bindEvents()
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("_move", () => {
    let inst: any

    beforeEach(() => {
        inst = new virchual.Virchual(document.querySelector("span:first-of-type"), {})
    })

    test("0", () => {
        let callFunction: any = () => {
            inst._move("Pierre Edouard", 1, {})
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            inst._move("Edmond", 1, {})
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            inst._move("Jean-Philippe", "Foo bar", {})
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            inst._move("Michael", "Hello, world!", {})
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            inst._move("Anas", 1, {})
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            inst._move("", -Infinity, {})
        }
    
        expect(callFunction).not.toThrow()
    })
})
