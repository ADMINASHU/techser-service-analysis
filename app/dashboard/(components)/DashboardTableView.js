const DashboardTableView = ({ data }) => {


    return (
    //   <div>
    //     <h2>Dashboard Table View</h2>
    //     <table>
    //       <thead>
    //         <tr>
    //           {Object.keys(data[0] || {}).map((key) => (
    //             <th key={key}>{key}</th>
    //           ))}
    //         </tr>
    //       </thead>
    //       <tbody>
    //         {data.map((item) => (
    //           <tr key={item.id}>
    //             {Object.values(item).map((value, index) => (
    //               <td key={index}>{value}</td>
    //             ))}
    //           </tr>
    //         ))}
    //       </tbody>
    //     </table>
    //   </div>
    <div>{JSON.stringify(data)}</div>
    );
  };
  
  export default DashboardTableView;
  