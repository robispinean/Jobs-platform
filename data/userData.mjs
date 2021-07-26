import bcrypt from 'bcryptjs'

const roles = [
    {
        name: 'admin'
    },
    {
        name: 'company'
    },
    {
        name: 'student'
    }
]

const users = [
    {
        email: 'Admin.User@email.com',
        password: bcrypt.hashSync('12345', 10),
        role: roles[0]
    },
    {
        email: 'Company.User@email.com',
        password: bcrypt.hashSync('12345', 10),
        role: roles[1]
    },
    {
        email: 'Student.User@email.com',
        password: bcrypt.hashSync('12345', 10),
        role: roles[2]
    }
]

export default users