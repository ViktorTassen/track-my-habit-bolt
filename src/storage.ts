import { Storage } from "@plasmohq/storage"

const DEFAULT_HABITS = [
  {
    id: "default-1",
    name: "Daily Exercise",
    color: "#4F46E5",
    createdAt: new Date().toISOString()
  }
]

export const storage = new Storage()

export const getHabits = async () => {
  const habits = await storage.get("habits")
  return habits ? JSON.parse(habits) : DEFAULT_HABITS
}

export const saveHabits = async (habits) => {
  await storage.set("habits", JSON.stringify(habits))
}

export const getLogs = async () => {
  const logs = await storage.get("habitLogs")
  return logs ? JSON.parse(logs) : []
}

export const saveLogs = async (logs) => {
  await storage.set("habitLogs", JSON.stringify(logs))
}</content>