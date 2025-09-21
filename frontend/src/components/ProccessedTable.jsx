import { easeInOut, easeOut, motion } from "framer-motion";
const ProcessedTable = ({ data }) => {
  if (!data || data.length === 0) return <p>No data available</p>;
  console.log(data);
  // Get table headers dynamically from keys of first object
  const headers = Object.keys(data[0]);
  return (
    <div className="overflow-x-auto">
      <motion.table
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.9,
          //delay: index * 0.1, // stagger effect
          ease: "easeIn",
        }}
        className="min-w-full border border-gray-300 text-black"
      >
        <thead className="bg-gray-200">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-2 border capitalize">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <motion.tr
              key={`${index}`}
              className="text-center text-primary  hover:bg-gray-100 group "
            >
              {headers.map((header) => (
                <td
                  key={`${index}-${header}`}
                  className="px-4 py-2 border group-hover:text-black"
                >
                  {row[header]}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </motion.table>
    </div>
  );
};

export default ProcessedTable;
