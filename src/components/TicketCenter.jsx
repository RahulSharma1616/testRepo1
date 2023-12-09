import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import SideNav from "./SideNav";
import Navbar from "./Navbar";
import Toast from "react-bootstrap/Toast";
import { MdInfoOutline } from "react-icons/md";

export default function TicketCenter() {

    const [isLoading, setIsLoading] = useState(true);
    const [cookies, setCookie] = useCookies(["token"]);

    const [tickets, setTickets] = useState([]);

    let [message, setMessage] = useState(""); // State variable for managing a message

    // This state variable manages the visibility of the toast.
    const [showToast, setShowToast] = useState(false);

    const [remarks, setRemarks] = useState("");

    // This function is responsible for toggling the state of the showToast variable.
    const toggleShowToast = () => setShowToast(!showToast);

    const [render, setRender] = useState(0);

    useEffect(() => {
        setIsLoading(true);
        axios({
            method: "get",
            url: "http://localhost:4000/ticket/elevated",
            headers: {
                Authorization: `Bearer ${cookies.token}`,
            },
        }).then(
            function (response) {
                setTickets(response.data);
                setIsLoading(false);
            },
            function (error) {
                console.log("error: ", error);
            }
        );
    }, [render]);

    function handleTicket(ticketID) {
        setIsLoading(true)
        axios({
            method: "patch",
            url: "http://localhost:4000/ticket/status",
            data: {
                ticketID: ticketID,
                status: "Closed",
                remarks: remarks
            },
            headers: {
                'Authorization': `Bearer ${cookies.token}`,
            }
        }).then((response) => {
            setMessage(response.data.message);
            setShowToast(true);
            setIsLoading(false);
            setRender(render + 1);
        })
    }

    return (
        <>
            <Navbar />
            {isLoading && (
                <div className="loader-overlay">
                    <div className="bouncing-loader">
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            )}
            <div className="row">
                <div className="col-lg-1 mt-6">
                    <SideNav />
                </div>
                <div className="col-lg-11 mt-6">
                    <div className="table-container">
                        <div className="timesheet-header d-flex justify-content-between">
                            <h3
                                className="h2 m-2"
                                style={{ fontWeight: "350", verticalAlign: "middle" }}
                            >
                                Ticket Center
                            </h3>
                        </div>
                        <div className="d-flex p-3">
                            <div className="recentTickets">
                                <div>
                                    {tickets.map((ticket) => {

                                        return (
                                            <div key={ticket._id} className="m-6" style={{ width: '83vw' }}>
                                                <ul>
                                                    <li>
                                                        <div className="shadow-lg p-3 ticketcard">
                                                            <div className="d-flex">
                                                                <div><img src={ticket.image.url} alt="User" className="user-image mb-3" style={{ width: "70px", height: "70px", borderRadius: "50%" }} /></div>
                                                                <div className="p-3"> <span className="h3 p-0" style={{ fontWeight: "500" }}>{ticket.name} </span></div>
                                                            </div>
                                                            <div className="mb-3">
                                                                <div><strong>Subject: </strong>{ticket.subject}</div>
                                                                <div><strong>Category: </strong>{ticket.category}</div>
                                                                {
                                                                    ticket.category == "Projects Inquiries" && (
                                                                        <div><strong>Project Code: </strong>{ticket.projectID}</div>
                                                                    )
                                                                }
                                                            </div>
                                                            <p>{ticket.description}</p>
                                                            {ticket.status == "Elevated" && <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                <input
                                                                    type="text"
                                                                    onChange={(e) => {setRemarks(e.target.value)}}
                                                                    className="form-control mb-4"
                                                                    style={{ width: '50%', margin: 'auto' }}
                                                                    placeholder="Write Your Remarks!"
                                                                />
                                                            </div>}
                                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                <button onClick={() => { handleTicket(ticket._id) }} className="btn btn-outline-info mx-1">
                                                                    Close Ticket
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                    {
                        tickets.length == 0 && (
                            <div className="fs-5 d-flex justify-content-center" style={{ color: "grey" }}>Looks like there are no tickets to show right now!</div>
                        )
                    }
                </div>
                <Toast
                    show={showToast}
                    delay={2000} autohide
                    className="px-0"
                    onClose={toggleShowToast}
                    style={{
                        position: "fixed",
                        bottom: "20px",
                        left: "50%",
                        transform: "translateX(-50%)",
                    }}
                >
                    <Toast.Body className="bg-success text-white">
                        <strong>
                            <MdInfoOutline size={25} /> {message}
                        </strong>
                        <button
                            type="button"
                            className="btn-close btn-close-white float-end"
                            onClick={toggleShowToast}
                        ></button>
                    </Toast.Body>
                </Toast>
            </div>
        </>
    );
}
