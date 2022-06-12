interface Employee {
     code: number,
     name: string
}

const employee1: Employee = {
     code: 10,
     name: "John"
}

console.log(`O funcionario ${employee1.name} está registrado sob o código ${employee1.code}`);