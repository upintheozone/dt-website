import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router';
import { Inter } from "next/font/google"
import styles from '@/styles/ViewTask.module.css'
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';

const inter = Inter({
  subsets: ['latin'] ,
  variable: '--inter-font',
})

export default function ViewTask() {

  // Getting task information based on UUID

  const router = useRouter();
  const [cookies] = useCookies(['todos']);
  const [task, setTask] = useState(null);
  const taskId = router.query.id;

  // Compare task id with tasks
  useEffect(() => {
    // console.log('cookies:', cookies);
    // console.log('taskId:', taskId);

    if (cookies.todos) {
      const task = cookies.todos.find(task => task.id === taskId);
      // console.log('found task:', task);
      setTask(task);
    }
  }, [cookies, taskId]);

  // Get priority for task (display it as a CSS class to distinct colors)
  function getClassForPriority(priority) {
    switch (priority) {
      case 'High':
        return 'highPriority';
      case 'Medium':
        return 'mediumPriority';
      case 'Low':
        return 'lowPriority';
      default:
        return '';
    }
  }

  // Get human readable due date for task (instead of "2023-06-07", show "June 7")
  function getHumanReadableDueDate(dueDate) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextFriday = new Date(today);
    nextFriday.setDate(nextFriday.getDate() + (5 + 7 - nextFriday.getDay()) % 7);
  
    const due = new Date(dueDate);
    if (due.toDateString() === today.toDateString()) {
      return 'Due Today';
    } else if (due.toDateString() === tomorrow.toDateString()) {
      return 'Due Tomorrow';
    } else {
      const options = { month: 'long', day: 'numeric' };
      return `Due ${due.toLocaleDateString(undefined, options)}`;
    }
  }

  // Seperate component to ensure no errors while rendering "undefined"
  const renderTask = () => {
    // console.log('renderTask - task:', task);
    if (!task) {
      return <div style={{textAlign:"center"}}><br /><br /><br /><br /><br />Loading...</div>;
    }
    return (
      <>
        <div className={styles.headerTop}>
          <Link href="/" className={styles.close}>
            <img src="/close.svg" className={styles.closeSvg} />
          </Link>
        </div>
        <div className={`${styles.header}  ${styles[getClassForPriority(task.priority)]}`}>
          <div className={styles.headerBottom}>
            <h1 className={styles.taskTitle}>{task.name}</h1>
            <p className={styles.taskDueDate}>🗓️ {''} {getHumanReadableDueDate(task.dueDate)}</p>
          </div>
        </div>

        <div className={styles.taskNotes}>
          <pre>{task.notes}</pre>
        </div>

        <div className={styles.taskOptions}>
          <Link href={`/timer?id=${task.id}`} className={styles.taskTimer}>
            <img src="/leaf.svg" className={styles.timerSvg} />
            <h3 className={styles.timerText}>Focus (25 min)</h3>
          </Link>
          <Link href={`/edittask?id=${task.id}`} className={styles.taskEdit}>
            <h3 className={styles.timerText}>Edit</h3>
          </Link>
        </div>
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
