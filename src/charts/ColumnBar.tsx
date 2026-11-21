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
    colorField : xField,
    scale: {
      color: {
        range: ['#f4664a', '#faad14', '#a0d911', '#52c41a', '#13c2c2', '#1890ff', '#2f54eb', '#722ed1'],
      },
    },
  };
  return <Column {...config} />;
};

export default ColumnBar
