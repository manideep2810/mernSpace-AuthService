function f(name: string) {
    const user = {
        fname: 'John',
    }
    const ffname = user.fname
    console.log(`Hello ${name} ${ffname}`)
}

f('World')
