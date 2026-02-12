import Navbar from '../componants/navbar';
import "../css/inventory.css"
const Inventory = () => {
    return(
        <div>
        <Navbar/> 
       <div className='inv-container'>
        <table>
            <tr>
            <th>Node</th>
            <th>Rack</th>
            <th>Shelf</th>
            <th>Slot</th>
            <th>Port</th>
            <th>ONU</th>
            </tr>


            <tr>
                <td>BKM_C300M_01</td>
                <td>1</td>
                <td>1</td>
                <td>1</td>
                <td>16</td>
                <td>64</td>
            </tr>

            <tr>
                <td>BKM_C300M_02</td>
                <td>1</td>
                <td>1</td>
                <td>1</td>
                <td>16</td>
                <td>64</td>
            </tr>

            <tr>
                <td>MAY_C300M_03</td>
                <td>1</td>
                <td>1</td>
                <td>1</td>
                <td>16</td>
                <td>64</td>
            </tr>

            <tr>
                <td>MAY_C300M_05</td>
                <td>1</td>
                <td>1</td>
                <td>1</td>
                <td>16</td>
                <td>64</td>
            </tr>

            

            <tr>
                <td>WM_C300M_02</td>
                <td>1</td>
                <td>1</td>
                <td>1</td>
                <td>16</td>
                <td>64</td>
            </tr>

            <tr>
                <td>WM_C300M_03
                </td>
                <td>1</td>
                <td>1</td>
                <td>1</td>
                <td>16</td>
                <td>64</td>
            </tr>

            <tr>
                <td>WM_C300M_04</td>
                <td>1</td>
                <td>1</td>
                <td>1</td>
                <td>16</td>
                <td>64</td>
            </tr>

      

  
        </table>

       </div>
      </div>
    )
}

export default Inventory;