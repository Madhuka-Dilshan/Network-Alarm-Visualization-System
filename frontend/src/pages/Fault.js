// import React, { useState, useEffect } from 'react';
// import Navbar from '../componants/navbar';
// import "../css/inventory.css";

// const Fault = () => {
//     const [data, setData] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);

//     // Fetch data from the backend
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await fetch('http://localhost:5000/api/inventory');
//                 const result = await response.json();
//                 setData(result);
//             } catch (error) {
//                 console.error('Error fetching Fault data:', error);
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchData();
//     }, []);

//     // Handle Delete
//     const handleDelete = async (id) => {
//         try {
//             const response = await fetch(`http://localhost:5000/api/inventory/${id}`, {
//                 method: 'DELETE',
//             });

//             if (response.ok) {
//                 setData(prevData => prevData.filter(item => item.id !== id)); // Remove row from state
//                 console.log('Row deleted successfully.');
//             } else {
//                 console.error('Error deleting row.');
//             }
//         } catch (error) {
//             console.error('Error deleting row:', error);
//         }
//     };

    
//     /*
//     const Fault = () => {
//     // Mockup data for testing
//     const mockupData = [
//         { id: 1, node: 'BKM_C300M_01', rack: '1', shelf: '1', slot: '1', port: '16', onu: '64' },
//         { id: 2, node: 'BKM_C300M_02', rack: '1', shelf: '1', slot: '1', port: '16', onu: '64' },
//         { id: 3, node: 'MAY_C300M_03', rack: '1', shelf: '1', slot: '1', port: '16', onu: '64' },
//     ];

//     const [data, setData] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);

//     // Simulate fetching data on component mount
//     useEffect(() => {
//         setTimeout(() => {
//             setData(mockupData);
//             setIsLoading(false);
//         }, 1000); // Simulates an API call delay
//     }, []);

//     // Handle delete functionality
//     const handleDelete = (id) => {
//         // Simulate deleting data from state
//         setData((prevData) => prevData.filter((item) => item.id !== id));
//         console.log(`Row with ID ${id} deleted.`);
//     };  */


//     return (
//         <div>
//             <Navbar />
//             <div className='inv-container'>
//                 {isLoading ? (
//                     <p>Loading...</p>
//                 ) : (
//                     <table>
//                         <thead>
//                             <tr>
//                                 <th>Node</th>
//                                 <th>Rack</th>
//                                 <th>Shelf</th>
//                                 <th>Slot</th>
//                                 <th>Port</th>
//                                 <th>ONU</th>
//                                 <th>Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {data.map((item) => (
//                                 <tr key={item.id}>
//                                     <td>{item.node}</td>
//                                     <td>{item.rack || ''}</td>
//                                     <td>{item.shelf || ''}</td>
//                                     <td>{item.slot || ''}</td>
//                                     <td>{item.port || ''}</td>
//                                     <td>{item.onu || ''}</td>
//                                     <td>
//                                         <button onClick={() => handleDelete(item.id)}>Delete</button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Fault;


import React, { useState, useEffect } from 'react';
import Navbar from '../componants/navbar';
import "../css/inventory.css";

const Fault = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch faulty nodes from the backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/faults/faulty-nodes');
                const result = await response.json();
                if (response.ok) {
                    setData(result.nodes); // Access `nodes` from the response
                } else {
                    console.error('Error fetching data:', result.message);
                }
            } catch (error) {
                console.error('Error fetching faulty nodes:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Handle Delete
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/faults/nodes/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setData(prevData => prevData.filter(item => item._id !== id)); // Remove row from state
                alert('Row deleted successfully.');
            } else {
                const result = await response.json();
                console.error('Error deleting row:', result.message);
                alert('Error deleting row.');
            }
        } catch (error) {
            console.error('Error deleting row:', error);
        }
    };

    return (
        <div>
            <Navbar />
            <div className='inv-container'>
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Node</th>
                                <th>Rack</th>
                                <th>Shelf</th>
                                <th>Slot</th>
                                <th>Port</th>
                                <th>ONU</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item) => (
                                <tr key={item._id}>
                                    <td>{item.node}</td>
                                    <td>{item.rack || ''}</td>
                                    <td>{item.shelf || ''}</td>
                                    <td>{item.slot || ''}</td>
                                    <td>{item.port || ''}</td>
                                    <td>{item.onu || ''}</td>
                                    <td>
                                        <button onClick={() => handleDelete(item._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Fault;
