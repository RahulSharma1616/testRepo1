import { Link } from "react-router-dom";
import SideNav from "./SideNav";
import Header from "./Header";
import TicketCard from "./TicketCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import Navbar from "./Navbar";

export default function Tickets() {

    const [isLoading, setIsLoading] = useState(false);
    const [cookies] = useCookies(['token']);
    const [ticketsData, setTicketsData] = useState([]);
    const [render, setRender] = useState(0);

    useEffect(() => {
        axios({
            method: "get",
            url: "http://localhost:4000/ticket/raised",
            headers: {
                'Authorization': `Bearer ${cookies.token}`,
            }
        }).then((response) => {
            setTicketsData(response.data.tickets);
            setIsLoading(false);
        })
    })

    return (
        <>
            {isLoading && (
                <div className="loader-overlay">
                    <div className="bouncing-loader">
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            )}
            <Navbar />
            <div className="row">
                <div className="col-lg-1 mt-6">
                    <SideNav />
                </div>
                <div className="col-lg-11 mt-6">
                    <div className="ticketsContainer ">
                        <Header render={render} setRender={setRender} />
                        <div className="d-flex p-3">
                            <div className="recentTickets">
                                <div>
                                    {
                                        ticketsData.map((ticket) => {
                                            return (
                                                <TicketCard key={ticket._id} ticket={ticket} />
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    ticketsData.length == 0 && (
                        <div className="fs-5 d-flex justify-content-center" style={{ color: "grey" }}>Looks like there are no tickets to show right now!</div>
                    )
                }
            </div>
        </>
    );
}