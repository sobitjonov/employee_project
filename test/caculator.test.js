const mathOperations = require('../calculator')

describe('Calculator Tests', ()=>{
    test('Addition of 2 numbers', ()=>{
        var result = mathOperations.sum(1,3)

        expect(result).toBe(4)
    })
    
    test('Substraction of 2 numbers', ()=>{
        var result = mathOperations.diff(11,3)

        expect(result).toBe(8)
    })

    test('Multiplication of 2 numbers', ()=>{
        var result = mathOperations.sum(1,3)

        expect(result).toBe(3)
    })

    test('Division of 2 numbers', ()=>{
        var result = mathOperations.sum(6,3)

        expect(result).toBe(2)
    })
})