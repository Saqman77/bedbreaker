import Robot from './Robot.js'

export default class FlyingRobot extends Robot
{
    constructor(name, legs)
    {
        super(name, legs)
    }

    sayHi()
    {
        console.log(`Hello! My name is ${this.name} and i'm a flying robot!`)
    }

    takeOff()
    {
        console.log(`Have good flite ${this.name}!`)
    }

    land()
    {
        console.log(`welcome back ${this.name}!`)
    }
}
