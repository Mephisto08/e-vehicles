import { DataGrid, FilterModel, ValueFormatterParams } from '@material-ui/data-grid';
import Button from '@material-ui/core/Button';
import React, { useEffect, useState } from 'react';
import { Vehicle } from '../../../util/EntityInterfaces';
import styled from 'styled-components';
import { Alert } from '@material-ui/lab';
import { Snackbar } from '@material-ui/core';

export const BatteryProgressNumber = styled.span`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  text-align: center;
  color: black;
`;

export const CreateButton = styled.div`
  margin-bottom: 2%;
`;

export const BatteryProgress = styled.progress`
  width: 100%;
  background: #75b800;
`;

export const Progressbar = styled.div`
  border-radius: 60px;
  overflow: hidden;
  width: 100%;
`;

export const VehicleTable = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    allVehicles();
  }, []);

  // get all vehicles
  const allVehicles = async () => {
    const vehicleRequest = await fetch(`/api/vehicle/`, {
      headers: { 'content-type': 'application/json' },
      method: 'GET',
    });
    if (vehicleRequest.status === 200) {
      const vehicleJSON = await vehicleRequest.json();
      setVehicles(vehicleJSON.data);
    }
  };

  // delete vehicles
  const deleteVehicles = async (id: string) => {
    // tslint:disable-next-line:prefer-template
    console.log(id);
    const vehicleRequest = await fetch(`/api/vehicle/` + id, {
      headers: { 'content-type': 'application/json' },
      method: 'DELETE',
    });
    if (vehicleRequest.status === 204) {
      await allVehicles();
      setOpen(true);
    }
  };

  // all Vehicles
  const vehicleRows: any[] = [];
  for (const vehicle of vehicles) {
    vehicleRows.push({
      battery: vehicle.batteryLevel,
      id: vehicle.vehicleId,
      license_plate: vehicle.licencePlate,
      status: vehicle.status,
      bookings: vehicle.bookings.length,
      type: vehicle.vehicleType.type,
      position: vehicle.positionLatitude + ' / ' + vehicle.positionLongitude,
      button: vehicle.vehicleId,
    });
  }

  const handleDeleteVehicle = async (e: any) => {
    let id = '';
    id = e.currentTarget.id;
    await deleteVehicles(id);
  };

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  // Filter model for vehicle table
  let vehicleFilterModel: FilterModel;
  vehicleFilterModel = {
    items: [{ columnField: 'license_plate', operatorValue: 'contains', value: '' }],
  };

  return (
    <>
      <CreateButton>
        <Button variant="outlined" color="primary">
          Create
        </Button>
      </CreateButton>
      <div style={{ height: 400, width: '100%' }}>
        <div style={{ display: 'flex', height: '100%' }}>
          <div style={{ flexGrow: 1 }}>
            <DataGrid
              columns={[
                { field: 'id', hide: true },
                {
                  field: 'license_plate',
                  headerName: 'License Plate',
                  width: 150,
                },
                { field: 'status', headerName: 'Status', width: 150 },
                {
                  field: 'battery',
                  headerName: 'Battery',
                  width: 100,
                  renderCell: (params: ValueFormatterParams) => (
                    <div style={{ position: 'relative' }}>
                      <Progressbar>
                        <BatteryProgress value={params.value.toString()} max="100" />
                        <BatteryProgressNumber>{params.value.toString()}</BatteryProgressNumber>
                      </Progressbar>
                    </div>
                  ),
                },
                { field: 'bookings', headerName: 'Number of bookings' },
                { field: 'type', headerName: 'Type' },
                { field: 'position', headerName: 'Position', width: 300 },
                {
                  field: 'button',
                  headerName: '',
                  width: 150,
                  renderCell: (params: ValueFormatterParams) => (
                    <strong>
                      <Button
                        id={params.value.toString()}
                        variant="outlined"
                        color="secondary"
                        size="small"
                        onClick={handleDeleteVehicle}
                        style={{ marginLeft: 16 }}
                      >
                        Delete
                      </Button>
                    </strong>
                  ),
                },
              ]}
              rows={vehicleRows}
              disableColumnMenu
              showToolbar
              filterModel={vehicleFilterModel}
            />
          </div>
        </div>
      </div>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          A Vehicle was sucessfully deleted!
        </Alert>
      </Snackbar>
    </>
  );
};
