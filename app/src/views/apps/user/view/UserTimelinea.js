// ** Custom Components
import Avatar from "@components/avatar";
import Timeline from "@components/timeline";
import { useState, Fragment, useEffect } from "react";

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody } from "reactstrap";
import { getUserLog } from "../../../../api/activity";

// ** Timeline Data
const UserTimeline = ({ selectedUser }) => {
  const [activity, setActivity] = useState([]);
  useEffect(() => {
    getMountedData();
  }, [selectedUser]);

  const getMountedData = async () => {
    let res = await getUserLog(selectedUser.id);
    setActivity(res.data);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle tag='h4'>User Activity Timeline</CardTitle>
      </CardHeader>
      <CardBody className='pt-1'>
        <Timeline data={activity} className='ms-50' />
      </CardBody>
    </Card>
  );
};

export default UserTimeline;
