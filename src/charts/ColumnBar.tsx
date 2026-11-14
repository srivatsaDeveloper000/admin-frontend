import { Column } from '@ant-design/plots';
import { useEffect, useState } from 'react';

const ColumnBar = ({ data, title }: { data: [], title: string }) => {

  const [xField, setXField] = useState<string>("");
  const [yField, setYField] = useState<string>("");

  useEffect(() => {
    if (!data || data.length === 0) {
      return
    };

    const data_keys = Object.keys(data[0] || []);
    setYField(data_keys[0])
    setXField(data_keys[1])
  }, [data]);

  const config = {
    data,
    title,
    xField,
    yField,
    legend: true,
  };
  return <Column {...config} />;
};

export default ColumnBar
