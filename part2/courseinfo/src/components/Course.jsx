import Header from "./Header"

const Part = ({name, exercises}) => {
  return (
    <p>
      {name} {exercises}
    </p>
  )
}

const Content = ({parts}) => {
  return (
    parts.map(part => <Part key={part.id} name={part.name} exercises={part.exercises}/>)
  )
}

const Total = ({parts}) => {
  const total = parts.reduce((accumulator, item) => accumulator + item.exercises, 0)
  return (
    <Header size={3} text={"total of "+total+" exercises"}  />
  )
}

const Course = ({courses}) => {
  return (
    <>
        <Header size={1} text={"Web development curriculum"}/>
        {courses.map(course=>
        <div key= {course.id}>
            <Header size={2} text={course.name} />
            <Content parts={course.parts} />
            <Total size={3} parts={course.parts} />
        </div>)}
    </>
  )
}

export default Course