import { useRef, useState ,useEffect} from "react";
import {
  SevenColGrid,
  Wrapper,
  HeadDays,
  DateControls,
  StyledEvent,
  SeeMore,
  PortalWrapper
} from "./Calender.styled";
import { DAYS, MOCKAPPS } from "./conts";
import {
  datesAreOnSameDay,
  getDarkColor,
  getDaysInMonth,
  getMonthYear,
  getSortedDays,
  nextMonth,
  prevMonth,
  range,
  sortDays
} from "./utils";

export const Calender = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2020, 4, 5));
  console.log(typeof currentDate)
  const [events, setEvents] = useState(MOCKAPPS);
  const dragDateRef = useRef();
  const[count,setCount]=useState(4)
  const dragindexRef = useRef();
  const [showPortal, setShowPortal] = useState(false);
  const [portalData, setPortalData] = useState({});
  const addEvent = (date,event,startTime,endTime) => {
    if (!event.target.classList.contains("StyledEvent")) {
      const text = window.prompt("name");
      if (text) {
        const startTime=window.prompt("StartTime")
        const endTime=window.prompt("EndTime")
        // date.setHours(0);
        // date.setSeconds(0);
        // date.setMilliseconds(0);
        setEvents((prev) => [
          ...prev,
          {date:date, title:text,startTime:startTime,endTime:endTime,color: getDarkColor() }
        ]);
          console.log(count)
          console.log(events)
          MOCKAPPS.push({date:date, title:text,startTime:startTime,endTime:endTime})
          const datas={date:date, title:text,startTime:startTime,endTime:endTime}
          localStorage.setItem("datas",JSON.stringify(datas))
          const storedData = localStorage.getItem('datas');
          // const parseData=JSON.parse(storedData)
          // console.log(parseData)
          // const day=localStorage.setItem("date",date)
          // const time1=localStorage.setItem("time1",startTime)
          // const time2=localStorage.setItem("time2",endTime)
          // const event_name=localStorage.setItem("eventName",text)

      }
    }
    
  };

  const drag = (index, e) => {
    dragindexRef.current = { index, target: e.target };
  };

  const onDragEnter = (date, e) => {
    e.preventDefault();
    dragDateRef.current = { date, target: e.target.id };
  };

  const drop = (ev) => {
    ev.preventDefault();

    setEvents((prev) =>
      prev.map((ev, index) => {
        if (index === dragindexRef.current.index) {
          ev.date = dragDateRef.current.date;
        }
        return ev;
      })
    );
  };

  const handleOnClickEvent = (event) => {
    setShowPortal(true);
    setPortalData(event);
  };

  const handlePotalClose = () => setShowPortal(false);

  const handleDelete = () => {
    setEvents((prevEvents) =>
      prevEvents.filter((ev) => ev.title !== portalData.title)
    );
    handlePotalClose();
  };

  return (
    <Wrapper>
      <DateControls style={{fontSize:"30px",fontWeight:"bold",color:"#1F2F98"}}>
        <ion-icon style={{background:"#787FF6"}}
          onClick={() => prevMonth(currentDate, setCurrentDate)}
          name="arrow-back-circle-outline"
        ></ion-icon>
        {getMonthYear(currentDate)}
        <ion-icon style={{background:"#787FF6"}}
          onClick={() => nextMonth(currentDate, setCurrentDate)}
          name="arrow-forward-circle-outline"
        ></ion-icon>
      </DateControls>
      <SevenColGrid>
        {DAYS.map((day) => (
          <HeadDays style={{color:"White",background:"#1CA7EC"}} className="nonDRAG">{day}</HeadDays>
        ))}
      </SevenColGrid>

      <SevenColGrid
        fullheight={true}
        is28Days={getDaysInMonth(currentDate) === 28}
      >
        {getSortedDays(currentDate).map((day) => (
          <div
            id={`${currentDate.getFullYear()}/${currentDate.getMonth()}/${day}`}
            onDragEnter={(e) =>
              onDragEnter(
                new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  day
                ),
                e
              )
            }
            onDragOver={(e) => e.preventDefault()}
            onDragEnd={drop}
            onClick={(e) =>
              addEvent(
                new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  day
                ),
                e
              )
            }
          >
            <span
              className={`nonDRAG ${
                datesAreOnSameDay(
                  new Date(),
                  new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    day
                  )
                )
                  ? "active"
                  : ""
              }`}
            >
              {day}
            </span>
            <EventWrapper>
              {events.map(
                (ev, index) =>
                  datesAreOnSameDay(
                    ev.date,
                    new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth(),
                      day
                    )
                  ) && (
                    <StyledEvent
                      onDragStart={(e) => drag(index, e)}
                      onClick={() => handleOnClickEvent(ev)}
                      draggable
                      className="StyledEvent"
                      id={`${"#4aDEDE"} ${ev.title}`}
                      key={ev.title}
                      bgColor={"#4aDEDE"}
                    >
                      {ev.title}-[{ev.startTime} TO {ev.endTime}]
                    </StyledEvent>
                  )
              )}
            </EventWrapper>
          </div>
        ))}
      </SevenColGrid>
      {showPortal && (
        <Portal
          {...portalData}
          handleDelete={handleDelete}
          handlePotalClose={handlePotalClose}
        />
      )}
    </Wrapper>
  );
};

const EventWrapper = ({ children }) => {
  if (children.filter((child) => child).length)
    return (
      <>
        {children}
        {children.filter((child) => child).length > 2 && (
          <SeeMore
            onClick={(e) => {
              e.stopPropagation();
              console.log("clicked p");
            }}
          >
            see more...
          </SeeMore>
        )}
      </>
    );
};

const Portal = ({ title, date, handleDelete, handlePotalClose }) => {
  return (
    <PortalWrapper>
      <h2>{title}</h2>
      <p>{date.toDateString()}</p>
      <ion-icon onClick={handleDelete} name="trash-outline"></ion-icon>
      <ion-icon onClick={handlePotalClose} name="close-outline"></ion-icon>
    </PortalWrapper>
  );
};
