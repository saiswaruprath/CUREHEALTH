// import { FormRow, FormRowSelect, Alert } from '../../components';
// import { useAppContext } from '../../context/appContext';
// import Wrapper from '../../assets/wrappers/DashboardFormPage';
// import MapContainer from '../../components/MapContainer';


// const AddJob = () => {
//   const {
//     isLoading,
//     isEditing,
//     showAlert,
//     displayAlert,
//     position,
//     company,
//     jobLocation,
//     jobType,
//     jobTypeOptions,
//     status,
//     statusOptions,
//     handleChange,
//     clearValues,
//     createJob,
//     editJob
//   } = useAppContext();

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!position || !company || !jobLocation) {
//       displayAlert();
//       return;
//     }
//     if (isEditing) {
//       editJob();
//       return;
//     }
//     createJob();
//   };

//   const handleJobInput = (e) => {
//     const name = e.target.name;
//     const value = e.target.value;
//     handleChange({ name, value});
//   };


//   return (
//     <Wrapper>
//       <form className='form'>
//         <h3>{isEditing ? 'edit job' : 'add job'} </h3>
//         {showAlert && <Alert />}

//         {/* position */}
//         <div className='form-center'>
//           <FormRow
//             type='text'
//             name='Location'
//             value={position}
//             handleChange={handleJobInput}
//           />
//           {/* company */}
//           <FormRow
//             type='text'
//             name='Distance'
//             value={company}
//             handleChange={handleJobInput}
//           />
//           {/* location */}
//           <FormRow
//             type='text'
//             labelText='State'
//             name='jobLocation'
//             value={jobLocation}
//             handleChange={handleJobInput}
//           />
//           {/* job type */}
//           <FormRowSelect
//       labelText='county'
//       name='county'
//       value={jobType}
//       handleChange={handleJobInput}
//       list={jobTypeOptions}
//     />
  
        

//           {/* job status */}
//           <FormRowSelect
//       name='street'
//       value={status}
//       handleChange={handleJobInput}
//       list={statusOptions}
//     />

//           <div className='btn-container'>
//             <button
//               className='btn btn-block submit-btn'
//               type='submit'
//               onClick={handleSubmit}
//               disabled={isLoading}
//             >
//               submit
//             </button>
//             <button
//       className='btn btn-block clear-btn'
//       onClick={(e) => {
//         e.preventDefault();
//         clearValues();
//       }}
//     >
//       clear
//     </button>
//           </div>
//         </div>
//       </form>
//       <h1>Treatment Facilities Map</h1>
//       <MapContainer />
//     </Wrapper>
//   );
// }

// export default AddJob

import MapContainer from '../../components/MapContainer';

function AddJob() {

  return (
    <div>
      <MapContainer />
    </div>
  )
}

export default AddJob