import tasksData from "@/services/mockData/tasks.json"

const tasksService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...tasksData]
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const task = tasksData.find(task => task.Id === id)
    if (!task) {
      throw new Error(`Task with ID ${id} not found`)
    }
    return { ...task }
  },

  async create(taskData) {
    await new Promise(resolve => setTimeout(resolve, 500))
    const newId = Math.max(...tasksData.map(task => task.Id)) + 1
    const newTask = { ...taskData, Id: newId }
    tasksData.push(newTask)
    return { ...newTask }
  },

  async update(id, taskData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const index = tasksData.findIndex(task => task.Id === id)
    if (index === -1) {
      throw new Error(`Task with ID ${id} not found`)
    }
    tasksData[index] = { ...taskData, Id: id }
    return { ...tasksData[index] }
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = tasksData.findIndex(task => task.Id === id)
    if (index === -1) {
      throw new Error(`Task with ID ${id} not found`)
    }
    tasksData.splice(index, 1)
    return true
  }
}

export default tasksService