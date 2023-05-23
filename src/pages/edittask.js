import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router';
import { Inter } from "next/font/google"
import styles from '@/styles/EditTask.module.css'
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';

const inter = Inter({
  subsets: ['latin'] ,
  variable: '--inter-font',
})

export default function EditTask() {

  // Getting task information based on UUID

  const router = useRouter();
  const [task, setTask] = useState(null);
  const [cookies, setCookie] = useCookies(['todos']);
  const taskId = router.query.id;

  // Compare task id with tasks
  useEffect(() => {
    if (cookies.todos) {
      const task = cookies.todos.find(task => task.id === taskId);
      setTask(task);
    }
  }, [cookies, taskId]);

  // Get form information and update task information
  const editTask = (event) => {
    event.preventDefault();

    // Get form information
    const form = event.target;
    const taskname = form.taskname.value;
    const duedate = form.duedate.value;
    const priority = form.priority.value;
    const notes = form.notes.value;

    // Save to temporary variable
    const updatedTask = {
      ...task,
      name: taskname,
      dueDate: duedate,
      priority: priority,
      notes: notes
    };

    // Check with each task and save to correct task
    const updatedTodos = cookies.todos.map((task) => {
      if (task.id === taskId) {
        return updatedTask;
      } else {
        return task;
      }
    });

    // Update cookies
    setCookie('todos', updatedTodos);
    router.back();
  };

  // Get form information and delete task with same task.id
  const deleteTask = () => {
    const updatedTodos = cookies.todos.filter(t => t.id !== taskId);
    setCookie('todos', updatedTodos);
    router.push('/');
  };

  
  // Seperate component to ensure no errors while rendering "undefined"
  const renderTask = () => {
    // console.log('renderTask - task:', task);
    if (!task) {
      return <div style={{textAlign:"center"}}><br /><br /><br /><br /><br />Loading...</div>;
    }
    return (
      <>
        <div className={styles.headerTop}>
          <Link href={`/viewtask?id=${task.id}`} className={styles.close}>
            <img src="/close.svg" className={styles.closeSvg} />
          </Link>
        </div>
        <div className={styles.header}>
          <div></div>
          <h1 className={styles.headerHeading}>Edit Current Task</h1>
        </div>
        <form onSubmit={editTask} className={styles.taskForm}>
          <div className={styles.taskBoxLarge}>
            <label className={styles.formLabel}>Task Name </label><br />
            <input type="text" id="taskname" name="taskname" autoComplete="off" defaultValue={task.name} readOnly />
          </div>
          <div className={styles.taskBoxDue}>
            <label className={styles.formLabel}>Due Date </label><br />
            <input type="date" id="duedate" name="duedate" autoComplete="off" defaultValue={task.dueDate} required />
          </div>
          <div className={styles.taskBoxPriority}>
            <label className={styles.formLabel}>Priority </label><br />
            <select id="priority" name="priority" autoComplete="off" defaultValue={task.priority} required>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div className={styles.taskBoxNotes}>
            <label className={styles.formLabel}>Notes </label><br />
            <textarea name="notes" autoComplete="off" defaultValue={task.notes} className={styles.taskNotes} style={{ height: '110px', width: '310px', resize: 'none' }}>
            </textarea>
          </div>
          <div className={styles.taskBoxOptions}>
            <input className={styles.taskBoxSubmit} type="submit" value="Update Task" />
            <div className={styles.taskBoxDelete} onClick={deleteTask}><img src="/delete.svg" className={styles.deleteSvg} /></div>
          </div>
        </form>
      </>
    );
  };

  // --- JSX code ---

  return (
    <>
      <Head>
        <title>View Task</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <main className={styles.main}>
        <div className={inter.variable}>
          <img src="/iPhone 13 - Starlight.png" className={styles.phoneBezel} />
          <div className={styles.container}>       
            {renderTask()}
          </div>
        </div>
      </main>
    </>
  )
}
