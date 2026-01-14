import fs from 'fs'
import path from 'path'

const filePath = path.join(process.cwd(), 'src', 'data', 'users.json')

export function getUsers() {
    if (!fs.existsSync(filePath)) {
        return []
    }
    const data = fs.readFileSync(filePath, 'utf8')
    try {
        return JSON.parse(data)
    } catch (e) {
        console.error('Error parsing users.json', e)
        return []
    }
}

export function saveUsers(users) {
    fs.writeFileSync(filePath, JSON.stringify(users, null, 4))
}

export function addUser(user) {
    const users = getUsers()
    // Check if user exists
    const exists = users.find(u => u.address.toLowerCase() === user.address.toLowerCase())
    if (exists) return exists

    users.push(user)
    saveUsers(users)
    return user
}
