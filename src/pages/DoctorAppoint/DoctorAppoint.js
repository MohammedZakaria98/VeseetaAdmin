import * as React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../Components/Sidebar/Sidebar';
import style from './DoctorAppoint.module.css';
import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
// import AddAppointments from './../AddAppointments/AddAppointments';
// import EditAppointments from './../EditAppointments/EditAppointments';
import Swal from "sweetalert2";
import '../../index.css'
import { db, auth } from '../../Firebase/Firebase';
import ReactPaginate from "react-paginate";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ReactApexChart from 'react-apexcharts';

// import userphone from '../../store/Actions/userphone'
const AppointmentsAppoint = () => {

    const navigate = useNavigate()
    const { t } = useTranslation();
    const [Appointments, setAppointments] = useState([])
    const [AllApp, setAllApp] = useState([])
    const [DoneCount, setDoneCount] = useState(1)
    const [DoneApp, setDoneApp] = useState([])
    const [date, setDate] = useState([])
    const [AppointmentsId, setAppointmentsId] = useState('')
    // const user = useSelector(state => state.user.user);
    // const userphone = useSelector(state => state.userphone.userphone);
    const userphone = sessionStorage.getItem("doctorPhone")
    console.log("usrphone in apponit", userphone)
    const user = localStorage.getItem('user');
    const state = {
      
        series: [{
          name: 'All Aoopintments',
          data: AllApp
        }, {
          name: 'Done Appointments',
          data: DoneApp
        }],
        options: {
          chart: {
            height: 350,
            type: 'area'
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: 'smooth'
          },
          xaxis: {
            type: 'datetime',
            categories: date
          },
          tooltip: {
            x: {
              format: 'dd/MM/yy HH:mm'
            },
          },
        },
      
      
      };
    
console.log("infoooooo", AllApp,DoneApp, date)
    function afterDelete(message, icon) {
        Swal.fire({
            title: message,
            icon: icon,
            showConfirmButton: false,
            timer: 1500
        });
    }

    function DeleteAlert(id) {
        Swal.fire({
            title: 'Are you sure?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                const AppointmentsRef = db.collection('Appointments').doc(id);
                AppointmentsRef.delete()
                    .then(() => {
                        setAppointments(Appointments.filter(d => d.id !== id));
                        afterDelete("Appointments deleted successfully.", "success");
                    })
                    .catch((error) => {
                        console.log(error);
                        afterDelete("Failed to delete Appointments.", "error");
                    });
            }
        });
    }

    function showAlert(message, icon) {
        Swal.fire({
          title: message,
          icon: icon,
          showConfirmButton: false,
          timer: 2000
        });
      }
    


      const updateField = (docId, field, value) => {
        db.collection('bookings').doc(docId).update({
          [field]: value
        })
        .then(() => {
          console.log("Document successfully updated!");
          fetchAppoint()
        })
        .catch((error) => {
          console.error("Error updating document: ", error);
        });
      }
    // const handleEditData = (id) => {
     
    
      
         
    //       db.collection("City")
    //         .doc(id)
    //         .update({
    //           Name: Name
    
    //         })
    //         .then(() => {
    //           console.log("Document successfully updated!");
    //           showAlert("Document successfully updated!", "success");
    //           let EditCity = document.getElementById("edit_city");
    //           EditCity.classList.add("d-none");
    //           props.fetchData();
    //         })
    //         .catch((error) => {
    //           console.error("Error updating document: ", error);
    //           showAlert("Error updating document", 'error')
    //         });
        
    
    //   };


    // const handleSubmit = async () => {
    //     try {
    //         await auth.signInWithEmailAndPassword("amanyasad88@gmail.com", "Amany@1234");

    //     } catch (error) {
    //         console.error(error);
    //     }
    // };







    const fetchAppoint = async () => {

        // const user = auth.currentUser;
        console.log("user", user);
        if (user) {
            try {
                const AppointmentsRef = db.collection('bookings');
                const AppointmentsSnapshot = await AppointmentsRef.get();
                const AppointmentsData = AppointmentsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

                console.log("Appointments", AppointmentsData);
                AppointmentsData.map((app, index) => {
                    console.log("app.docror", app.doctor)
                    console.log("app.docror.id", app.doctorID)
                })
                let allapp = [];
                let doneapp = [];
                let dateapp = [];
                let test = [];
                setDoneCount(1)
                let newAppoint = AppointmentsData.filter(apoint => apoint.mobile == userphone)
                newAppoint.map((item, index)=>{

                    allapp.push(index+1);
                    dateapp.push(item.dateSelected)
                   test.push(item)
                    
                  
                })
                let doneAppoint = test.filter(apoint => apoint.status === "done")
                doneAppoint.map((item, index)=>{

                    doneapp.push(index+1);
                 
                   
                })
                setAllApp(allapp)
                setDoneApp(doneapp)
                setDate(dateapp)
                console.log("newApp", newAppoint)
                setAppointments(newAppoint);
            } catch (error) {
                console.log(error);
            }


        }
    };

    const [currentPage, setCurrentPage] = useState(0);
    let PER_PAGE = 10;
    let offset = currentPage * PER_PAGE;
    let currentPageData = Appointments.slice(offset, offset + PER_PAGE).map((Appointments, index) => {
        return (
            <>
                <tr key={index} className={`${style.tr_shadow}`}>
                    <td>{index + 1}</td>
                    <td><i class="bi bi-person-fill me-2"></i> {Appointments.name}</td>
                    <td>{Appointments.dateSelected}</td>
                    <td>{Appointments.timeSelected}</td>
                    <td>{Appointments.email}</td>
                    <td>{Appointments.mobile}</td>
                    <td>{Appointments.notes}</td>


                    <td>
                        <div className="d-flex justify-content-around">

                            <div className='d-flex mx-2'>
                                <input type="radio" id="wait"  checked={Appointments.status === 'wait'} onChange={()=>{
                                    updateField(Appointments.id, 'status', 'wait');
                                }}/>
                                <label for="wait" className='px-2'>Wait</label>
                            </div>
                            <div className='d-flex mx-2'>
                                <input type="radio" id="done"  checked={Appointments.status === 'done'}onChange={()=>{
                                   updateField(Appointments.id, 'status', 'done');
                                }} />
                                <label for="done" className='px-2'>Done</label>
                            </div>
                            {/* <Link className="item p-2" type='button' onClick={() => {
                            window.scrollTo(0, 0);
                            setAppointmentsId(Appointments.id);
                            // let editAppointments = document.getElementById("edit_Appointments");
                            // editAppointments.classList.remove("d-none");

                            // let addAppointments = document.getElementById("add_Appointments");
                            // if (addAppointments.classList.contains('d-none') === false) {
                            //     addAppointments.classList.add("d-none");
                            // }
                        }}>
                            <i className={`bi bi-eye-fill fs-6   ${style.text_creat}`} ></i>
                        </Link> */}

                            {/* <form>
                            <Link type='button' className="item p-2"
                                onClick={() => {
                                    DeleteAlert(Appointments.id)
                                }}>
                                <i className="fa-solid fa-trash fs-6 text-danger"></i>
                            </Link>
                        </form> */}
                        </div>
                    </td>
                </tr>
            </>
        )
    });
    let pageCount = Math.ceil(Appointments.length / PER_PAGE);

    function handlePageClick({ selected: selectedPage }) {
        setCurrentPage(selectedPage);
    }



    useEffect(() => {
        // handleSubmit();
        fetchAppoint();

        // if(!userphone){
        //     navigate("/login")
        // }
    }, [userphone]);


    console.log("Appointments", Appointments)
    // console.log("Appointments Doctor", Appointments.Doctor)

    return (
        <>

            {/* <Sidebar /> */}
            <section className=' py-2 mt-5'>
                <div className='container px-3 min-vh-100 mt-5' >
                    <div className='page_content'>
                        <div className="">
                            <div className="row justify-content-center mx-2">
                                <div className="col-lg-12 row my-4">
                                    <div className='col-6 p-0'>
                                        <h2 >{t("_Appointments")}</h2>
                                    </div>

                                    <div id="chart">
                                        <ReactApexChart options={state.options} series={state.series} type="area" height={350} />
                                    </div>
                                    <div className={`${style.pull_right} col-6 p-0`}>
                                        {/* <Link className={` btn ${style.btnCreate} float-end`} type="button" onClick={() => {
                                            // let addAppointments = document.getElementById("add_Appointments");
                                            // addAppointments.classList.remove("d-none");

                                            // let editAppointments = document.getElementById("edit_Appointments");
                                            // if (editAppointments.classList.contains('d-none') === false) {
                                            //     editAppointments.classList.add("d-none");
                                            // }
                                        }}>  + {t("one_Appointments")}</Link> */}
                                    </div>
                                    <br />
                                    <br />
                                </div>
                            </div>

                            {/* <div id="add_Appointments" className='d-none'>
                                <AddAppointments fetchData={fetchAppoint} />
                            </div>



                            <div id="edit_Appointments" className='d-none'>
                                <EditAppointments id={AppointmentsId} fetchData={fetchAppoint} />
                            </div> */}


                        </div>
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-md-12">

                                    <div className="table-responsive table-responsive-data2" style={{ maxHeight: "100vh" }}>
                                        <table className={`table ${style.table_data2}  `} >
                                            <thead className={`${style.thead} text-white`}>
                                                <tr>
                                                    <th className='text-white'>{t("id")}</th>
                                                    <th className='text-white'>{t("item_name")} </th>
                                                    <th className='text-white'>{t("item_date")}</th>
                                                    <th className='text-white'>{t("item_time")} </th>
                                                    <th className='text-white'>{t("item_email")} </th>
                                                    <th className='text-white'>{t("item_phone")} </th>
                                                    <th className='text-white'>{t("item_notes")} </th>



                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentPageData}


                                            </tbody>
                                        </table>
                                        <div className="w-75 mx-auto">

                                            <ReactPaginate
                                                nextLabel={t("next")}
                                                onPageChange={handlePageClick}
                                                pageRangeDisplayed={3}
                                                marginPagesDisplayed={2}
                                                pageCount={pageCount}
                                                previousLabel={t("prev")}
                                                pageClassName="page-item"
                                                pageLinkClassName="page-link"
                                                previousClassName="page-item"
                                                previousLinkClassName="page-link"
                                                nextClassName="page-item"
                                                nextLinkClassName="page-link"
                                                breakLabel="..."
                                                breakClassName="page-item"
                                                breakLinkClassName="page-link"
                                                containerClassName="pagination"
                                                activeClassName="active"
                                                renderOnZeroPageCount={null}
                                            />


                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}

export default AppointmentsAppoint;


