import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router';
import { Inter } from "next/font/google"
import styles from '@/styles/AddTask.module.css'
import { useState, useEffect, useCallback } from 'react';
import { useCookies } from 'react-cookie';

import { v4 as uuidv4 } from 'uuid';

const inter = Inter({
  subsets: ['latin'] ,
  variable: '--inter-font',
})

export default function AddTask() {

  // --- Todo list cookies ---

  const router = useRouter();
  const [todos, setTodos] = useState([]);
  const [cookies, setCookie] = useCookies(['todos']);

  // Read todos cookie
  useEffect(() => {
    const todosFromCookies = cookies.todos || [];
    setTodos(todosFromCookies);
  }, [setTodos]);

  // Write todos cookie on update
  useEffect(() => {
    setCookie('todos', todos, { path: '/' });
  }, [todos, setCookie]);

  // Get form data and write to todo
  const addTask = useCallback((event) => {
    event.preventDefault();

    // Get form information
    const form = event.target;
    const taskname = form.taskname.value;
    const duedate = form.duedate.value;
    const priority = form.priority.value;
    const notes = form.notes.value;

    // Save form information to variable
    const newTask = {
      id: uuidv4(), // Generate a unique UUID for each task
      name: taskname,
      dueDate: duedate,
      priority: priority,
      notes: notes
    };

    // Add variable to cookie
    setTodos(prevTodos => [...prevTodos, newTask]);

    router.push('/');
  }, []);

  // --- JSX code ---

  return (
    <>
      <Head>
        <title>Add Task</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <main className={styles.main}>
        <div className={inter.variable}>
          <img src="/iPhone 13 - Starlight.png" className={styles.phoneBezel} />
          <div className={styles.container}>
            <div className={styles.headerTop}>
                <Link href="/" className={styles.close}>
                  <img src="/close.svg" className={styles.closeSvg} />
                </Link>
            </div>

            <div className={styles.header}>
              <div></div>
              <h1 className={styles.headerHeading}>Create New Task</h1>
            </div>

            <form onSubmit={addTask} className={styles.taskForm}>
              <div className={styles.taskBoxLarge}>
                <label className={styles.formLabel}>Task Name </label><br />
                <input type="text" id="taskname" name="taskname" autoComplete="off" required />
              </div>
              <div className={styles.taskBoxDue}>
                <label className={styles.formLabel}>Due Date </label><br />
                <input type="date" id="duedate" name="duedate" autoComplete="off" required />
              </div>
              <div className={styles.taskBoxPriority}>
                <label className={styles.formLabel}>Priority </label><br />
                <select id="priority" name="priority" autoComplete="off" required>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div className={styles.taskBoxNotes}>
                <label className={styles.formLabel}>Notes </label><br />
                <textarea name="notes" autoComplete="off" className={styles.taskNotes} style={{ height: '110px', width: '310px', resize: 'none' }}>
                </textarea>
              </div>
              <input className={styles.taskBoxSubmit} type="submit" value="Add Task" />
            </form>
          </div>
        </div>
      </main>
    </>
  )
}
