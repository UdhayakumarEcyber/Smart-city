import React, { useState } from 'react';
import { WidgetWrapper, Modal } from 'uxp/components';
import { IContextProvider } from '../uxp';
import axios from 'axios';
import { ProgressBar, Alert, Dropdown, DropdownButton, Button, Spinner } from 'react-bootstrap';

interface IMapChangeMode {
  uxpContext: IContextProvider;
}

const JsonUploader: React.FunctionComponent<IMapChangeMode> = (props) => {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [modelType, setModelType] = useState<keyof typeof fieldMap>('Street Lights');
  const [showUploader, setShowUploader] = useState(false);
  const [showSGModal, setShowSGModal] = useState(false);
  const [loadingBox, setLoadingBox] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files ? event.target.files[0] : null);
    setError(null);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setFile(event.dataTransfer.files[0]);
    setError(null);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleFileUpload = async () => {
    if (file) {
      setLoadingBox(true);
      setTimeout(async () => {
        setLoadingBox(false);
        setUploading(true);
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            setProgress(25);
            const jsonData = JSON.parse(event.target?.result as string);
            setProgress(50);
            const formattedData = formatData(jsonData);
            setData(formattedData);
            setProgress(75);
            await sendDataToAPI(formattedData);
            setProgress(100);
            setError(null);
          } catch (e) {
            setError('Error parsing JSON file');
            setData(null);
            setProgress(0);
          } finally {
            setUploading(false);
          }
        };
        reader.readAsText(file);
      }, 5000); // Simulate loading box for 5 seconds
    } else {
      setError('No file selected');
    }
  };

  const fieldMap = {
    'Street Lights': ['id', 'location.value.coordinates', 'areaServed.value'],
    'Industrial Site A': ['name', 'zip'],
    'Housing Board': ['email', 'phone'],
    'Hospitals': ['age', 'birthday']
  };

  const requiredFields = {
    'Street Lights': ['id', 'location.value.coordinates'],
    'Industrial Site A': ['name', 'zip'],
    'Housing Board': ['email', 'phone'],
    'Hospitals': ['age', 'birthday']
  };

  const formatData = (data: any) => {
    const fields = fieldMap[modelType];
    const results: any = {};

    fields.forEach(field => {
      const result = findField(data, field);
      if (result) {
        results[field] = result;
      }
    });

    const required = requiredFields[modelType];
    for (let field of required) {
      if (!findField(data, field)) {
        throw new Error(`Invalid file format: Missing required field "${field}"`);
      }
    }

    return results;
  };

  const findField = (obj: any, field: string): any => {
    const keys = field.split('.');
    let result = obj;
    for (let key of keys) {
      if (result[key] !== undefined) {
        result = result[key];
      } else {
        return null;
      }
    }
    return result;
  };

  const sendDataToAPI = async (data: any) => {
    try {
      const response = await axios.post('https://example.com/api/upload', data);
      console.log('Data sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending data to API:', error);
    }
  };

  const handleModelSelect = (eventKey: string | null, event: React.SyntheticEvent<unknown>) => {
    const model = eventKey as keyof typeof fieldMap;
    setModelType(model);
    setData(null); // Clear previous data when model type is changed
    setError(null); // Clear previous error when model type is changed
  };

  return (
    <WidgetWrapper className="smart-city_box empty-box">
      <div>
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            cursor: 'pointer',
            zIndex: 1000
          }}
          onClick={() => setShowSGModal(true)}
        >
          <img src="https://static.iviva.com/images/Udhayimages/cloud-upload.png" alt="Upload Icon" width="32" height="32" />
        </div>
        <Modal className='json-uploader'
          show={showSGModal} title='POI Controller'
          onOpen={() => { }}
          onClose={() => setShowSGModal(false)}
        >
          <div className="json-uploader-widget">
            <h2>Upload JSON File</h2>
            <DropdownButton
              id="dropdown-basic-button"
              title={`Model: ${modelType}`}
              onSelect={handleModelSelect}
              style={{ marginBottom: '10px', position: "relative" }}
              variant="success"
            >
              <Dropdown.Item eventKey="Street Lights">Street Lights</Dropdown.Item>
              <Dropdown.Item eventKey="Industrial Site A">Industrial Site A</Dropdown.Item>
              <Dropdown.Item eventKey="Housing Board">Housing Board</Dropdown.Item>
              <Dropdown.Item eventKey="Hospitals">Hospitals</Dropdown.Item>
            </DropdownButton>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => document.getElementById('file-input').click()}
              style={{
                border: '2px dashed #3c763d',
                padding: '20px',
                borderRadius: '10px',
                textAlign: 'center',
                color: '#3c763d',
                marginBottom: '10px',
                cursor: 'pointer'
              }}
            >
              {file ? file.name : 'Drag & drop a JSON file here, or click to select one'}
              <input
                id="file-input"
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="file-input"
                style={{ display: 'none' }}
              />
            </div>
            <Button onClick={handleFileUpload} disabled={uploading || loadingBox} className="upload-button">
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
            {loadingBox && (
              <div className="loading-box" style={{ textAlign: 'center', marginTop: '10px' }}>
                {/* <Spinner animation="border" role="status">
                  <span className="sr-only">Loading...</span>
                </Spinner> */}
                <p>Loading...</p>
              </div>
            )}
            {error && <Alert variant="danger">{error}</Alert>}
            {/* {uploading && <ProgressBar animated now={progress} label={`${progress}%`} className="progress-bar" />} */}
            {data && (
              <div className="data-preview">
                <h3>Parsed Data</h3>
                <pre>{JSON.stringify(data, null, 2)}</pre>
              </div>
            )}
          </div>
        </Modal>
      </div>
    </WidgetWrapper>
  );
};

export default JsonUploader;




















// import React, { useState } from 'react';
// import { WidgetWrapper, Modal } from 'uxp/components';
// import { IContextProvider } from '../uxp';
// import axios from 'axios';
// import { ProgressBar, Alert, Dropdown, DropdownButton, Button } from 'react-bootstrap';

// interface IMapChangeMode {
//   uxpContext: IContextProvider;
// }

// const JsonUploader: React.FunctionComponent<IMapChangeMode> = (props) => {
//   const [file, setFile] = useState<File | null>(null);
//   const [data, setData] = useState<any | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [uploading, setUploading] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [modelType, setModelType] = useState<keyof typeof fieldMap>('Street Lights');
//   const [showUploader, setShowUploader] = useState(false);
//   const [ShowSGModal, setShowSGModal] = useState(false);

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setFile(event.target.files ? event.target.files[0] : null);
//     setError(null);
//   };

//   const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
//     event.preventDefault();
//     setFile(event.dataTransfer.files[0]);
//     setError(null);
//   };

//   const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
//     event.preventDefault();
//   };

//   const handleFileUpload = async () => {
//     if (file) {
//       setUploading(true);
//       const reader = new FileReader();
//       reader.onload = async (event) => {
//         try {
//           setProgress(25);
//           const jsonData = JSON.parse(event.target?.result as string);
//           setProgress(50);
//           const formattedData = formatData(jsonData);
//           setData(formattedData);
//           setProgress(75);
//           await sendDataToAPI(formattedData);
//           setProgress(100);
//           setError(null);
//         } catch (e) {
//           setError('Error parsing JSON file');
//           setData(null);
//           setProgress(0);
//         } finally {
//           setUploading(false);
//         }
//       };
//       reader.readAsText(file);
//     } else {
//       setError('No file selected');
//     }
//   };

//   const fieldMap = {
//     'Street Lights': ['id', 'location.value.coordinates', 'areaServed.value'],
//     'Industrial Site A': ['name', 'zip'],
//     'Housing Board': ['email', 'phone'],
//     'Hospitals': ['age', 'birthday']
//   };

//   const requiredFields = {
//     'Street Lights': ['id', 'location.value.coordinates'],
//     'Industrial Site A': ['name', 'zip'],
//     'Housing Board': ['email', 'phone'],
//     'Hospitals': ['age', 'birthday']
//   };

//   const formatData = (data: any) => {
//     const fields = fieldMap[modelType];
//     const results: any = {};

//     fields.forEach(field => {
//       const result = findField(data, field);
//       if (result) {
//         results[field] = result;
//       }
//     });

//     const required = requiredFields[modelType];
//     for (let field of required) {
//       if (!findField(data, field)) {
//         throw new Error(`Invalid file format: Missing required field "${field}"`);
//       }
//     }

//     return results;
//   };

//   const findField = (obj: any, field: string): any => {
//     const keys = field.split('.');
//     let result = obj;
//     for (let key of keys) {
//       if (result[key] !== undefined) {
//         result = result[key];
//       } else {
//         return null;
//       }
//     }
//     return result;
//   };

//   const sendDataToAPI = async (data: any) => {
//     try {
//       const response = await axios.post('https://example.com/api/upload', data);
//       console.log('Data sent successfully:', response.data);
//     } catch (error) {
//       console.error('Error sending data to API:', error);
//     }
//   };

//   const handleModelSelect = (eventKey: string | null, event: React.SyntheticEvent<unknown>) => {
//     const model = eventKey as keyof typeof fieldMap;
//     setModelType(model);
//     setData(null); // Clear previous data when model type is changed
//     setError(null); // Clear previous error when model type is changed
//   };

//   return (
//     <WidgetWrapper className="smart-city_box empty-box">
//       <div>
//         <div
//           style={{
//             position: 'fixed',
//             top: '20px',
//             right: '20px',
//             cursor: 'pointer',
//             zIndex: 1000
//           }}
//           onClick={() => setShowSGModal(true)}
//         >
//           <img src="https://static.iviva.com/images/Udhayimages/cloud-upload.png" alt="Upload Icon" width="32" height="32" />
//         </div>
//         <Modal className='json-uploader'
//           show={ShowSGModal} title='POI Controller'
//           onOpen={() => { }}
//           onClose={() => setShowSGModal(false)}
//         >
          
//             <div className="json-uploader-widget">
//               <h2>Upload JSON File</h2>
//               <DropdownButton
//                 id="dropdown-basic-button"
//                 title={`Model: ${modelType}`}
//                 onSelect={handleModelSelect}
//                 style={{ marginBottom: '10px', position:"relative" }}
//                 variant="success"
//               >
//                 <Dropdown.Item eventKey="Street Lights">Street Lights</Dropdown.Item>
//                 <Dropdown.Item eventKey="Industrial Site A">Industrial Site A</Dropdown.Item>
//                 <Dropdown.Item eventKey="Housing Board">Housing Board</Dropdown.Item>
//                 <Dropdown.Item eventKey="Hospitals">Hospitals</Dropdown.Item>
//               </DropdownButton>
//               <div
//                 onDrop={handleDrop}
//                 onDragOver={handleDragOver}
//                 onClick={() => document.getElementById('file-input').click()}
//                 style={{
//                   border: '2px dashed #3c763d',
//                   padding: '20px',
//                   borderRadius: '10px',
//                   textAlign: 'center',
//                   color: '#3c763d',
//                   marginBottom: '10px',
//                   cursor: 'pointer'
//                 }}
//               >
//                 {file ? file.name : 'Drag & drop a JSON file here, or click to select one'}
//                 <input
//                   id="file-input"
//                   type="file"
//                   accept=".json"
//                   onChange={handleFileChange}
//                   className="file-input"
//                   style={{ display: 'none' }}
//                 />
//               </div>
//               <Button onClick={handleFileUpload} disabled={uploading} className="upload-button">
//                 {uploading ? 'Uploading...' : 'Upload'}
//               </Button>
//               {error && <Alert variant="danger">{error}</Alert>}
//               {uploading && <ProgressBar animated now={progress} label={`${progress}%`} className="progress-bar" />}
//               {data && (
//                 <div className="data-preview">
//                   <h3>Parsed Data</h3>
//                   <pre>{JSON.stringify(data, null, 2)}</pre>
//                 </div>
//               )}
//             </div>
           
//         </Modal>
//       </div>
//     </WidgetWrapper>
//   );
// };

// export default JsonUploader;



























// import React, { useState } from 'react';
// import { WidgetWrapper, Modal } from 'uxp/components';
// import { IContextProvider } from '../uxp';
// import axios from 'axios';
// import { ProgressBar, Alert, Dropdown, DropdownButton, Button } from 'react-bootstrap';

// interface IMapChangeMode {
//   uxpContext: IContextProvider;
// }

// const JsonUploader: React.FunctionComponent<IMapChangeMode> = (props) => {
//   const [file, setFile] = useState<File | null>(null);
//   const [data, setData] = useState<any | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [uploading, setUploading] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [modelType, setModelType] = useState<keyof typeof fieldMap>('Street Lights');
//   const [showUploader, setShowUploader] = useState(false);
//   const [ShowSGModal, setShowSGModal] = useState(false);

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setFile(event.target.files ? event.target.files[0] : null);
//     setError(null);
//   };

//   const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
//     event.preventDefault();
//     setFile(event.dataTransfer.files[0]);
//     setError(null);
//   };

//   const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
//     event.preventDefault();
//   };

//   const handleFileUpload = async () => {
//     if (file) {
//       setUploading(true);
//       const reader = new FileReader();
//       reader.onload = async (event) => {
//         try {
//           setProgress(25);
//           const jsonData = JSON.parse(event.target?.result as string);
//           setProgress(50);
//           const formattedData = formatData(jsonData);
//           setData(formattedData);
//           setProgress(75);
//           await sendDataToAPI(formattedData);
//           setProgress(100);
//         } catch (e) {
//           setError('Error parsing JSON file');
//           setProgress(0);
//         } finally {
//           setUploading(false);
//         }
//       };
//       reader.readAsText(file);
//     } else {
//       setError('No file selected');
//     }
//   };

//   const fieldMap = {
//     'Street Lights': ['id', 'location.value.coordinates', 'areaServed.value'],
//     'Industrial Site A': ['name', 'zip'],
//     'Housing Board': ['email', 'phone'],
//     'Hospitals': ['age', 'birthday']
//   };

//   const formatData = (data: any) => {
//     const fields = fieldMap[modelType];
//     const results: any = {};

//     fields.forEach(field => {
//       const result = findField(data, field);
//       if (result) {
//         results[field] = result;
//       }
//     });

//     // Check if required Fields 'id' and "coordinates" exist
//     if (!results.id || !results['location.value.coordinates']) {
//       throw new Error('Invalid file format: Missing required fields "id" or "coordinates"');
//     }

//     return results;
//   };

//   const findField = (obj: any, field: string): any => {
//     const keys = field.split('.');
//     let result = obj;
//     for (let key of keys) {
//       if (result[key] !== undefined) {
//         result = result[key];
//       } else {
//         return null;
//       }
//     }
//     return result;
//   };

//   const sendDataToAPI = async (data: any) => {
//     try {
//       const response = await axios.post('https://example.com/api/upload', data);
//       console.log('Data sent successfully:', response.data);
//     } catch (error) {
//       console.error('Error sending data to API:', error);
//     }
//   };

//   const handleModelSelect = (eventKey: string | null, event: React.SyntheticEvent<unknown>) => {
//     const model = eventKey as keyof typeof fieldMap;
//     setModelType(model);
//   };

//   return (
//     <WidgetWrapper className="smart-city_box empty-box">
//       <div>
//         <div
//           style={{
//             position: 'fixed',
//             top: '20px',
//             right: '20px',
//             cursor: 'pointer',
//             zIndex: 1000
//           }}
//           onClick={() => setShowSGModal(true)}
//         >
//           <img src="https://static.iviva.com/images/Udhayimages/cloud-upload.png" alt="Upload Icon" width="32" height="32" />
//         </div>
//         <Modal className='json-uploader'
//           show={ShowSGModal} title='POI Controller'
//           onOpen={() => { }}
//           onClose={() => setShowSGModal(false)}
//         >
//           <WidgetWrapper className="smart-city_box ">
//             <div className="json-uploader-widget">
//               <h2>Upload JSON File</h2>
//               <DropdownButton
//                 id="dropdown-basic-button"
//                 title={`Model: ${modelType}`}
//                 onSelect={handleModelSelect}
//                 style={{ marginBottom: '10px' }}
//                 variant="success"
//               >
//                 <Dropdown.Item eventKey="Street Lights">Street Lights</Dropdown.Item>
//                 <Dropdown.Item eventKey="Industrial Site A">Industrial Site A</Dropdown.Item>
//                 <Dropdown.Item eventKey="Housing Board">Housing Board</Dropdown.Item>
//                 <Dropdown.Item eventKey="Hospitals">Hospitals</Dropdown.Item>
//               </DropdownButton>
//               <div
//                 onDrop={handleDrop}
//                 onDragOver={handleDragOver}
//                 onClick={() => document.getElementById('file-input').click()}
//                 style={{
//                   border: '2px dashed #3c763d',
//                   padding: '20px',
//                   borderRadius: '10px',
//                   textAlign: 'center',
//                   color: '#3c763d',
//                   marginBottom: '10px',
//                   cursor: 'pointer'
//                 }}
//               >
//                 {file ? file.name : 'Drag & drop a JSON file here, or click to select one'}
//                 <input
//                   id="file-input"
//                   type="file"
//                   accept=".json"
//                   onChange={handleFileChange}
//                   className="file-input"
//                   style={{ display: 'none' }}
//                 />
//               </div>
//               <Button onClick={handleFileUpload} disabled={uploading} className="upload-button">
//                 {uploading ? 'Uploading...' : 'Upload'}
//               </Button>
//               {error && <Alert variant="danger">{error}</Alert>}
//               {uploading && <ProgressBar animated now={progress} label={`${progress}%`} className="progress-bar" />}
//               {data && (
//                 <div className="data-preview">
//                   <h3>Parsed Data</h3>
//                   <pre>{JSON.stringify(data, null, 2)}</pre>
//                 </div>
//               )}
//             </div>
//           </WidgetWrapper>
//         </Modal>
//       </div>
//     </WidgetWrapper>
//   );
// };

// export default JsonUploader;













// import React, { useState } from 'react';
// import { WidgetWrapper, Modal } from 'uxp/components';
// import { IContextProvider } from '../uxp';
// import axios from 'axios';
// import { ProgressBar, Alert, Dropdown, DropdownButton, Button } from 'react-bootstrap';

// interface IMapChangeMode {
//   uxpContext: IContextProvider;
// }

// const JsonUploader: React.FunctionComponent<IMapChangeMode> = (props) => {
//   const [file, setFile] = useState<File | null>(null);
//   const [data, setData] = useState<any | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [uploading, setUploading] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [modelType, setModelType] = useState<keyof typeof fieldMap>('Street Lights');
//   const [showUploader, setShowUploader] = useState(false);
//   const [ShowSGModal, setShowSGModal] = useState(false);

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setFile(event.target.files ? event.target.files[0] : null);
//     setError(null);
//   };

//   const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
//     event.preventDefault();
//     setFile(event.dataTransfer.files[0]);
//     setError(null);
//   };

//   const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
//     event.preventDefault();
//   };

//   const handleFileUpload = async () => {
//     if (file) {
//       setUploading(true);
//       const reader = new FileReader();
//       reader.onload = async (event) => {
//         try {
//           setProgress(25);
//           const jsonData = JSON.parse(event.target?.result as string);
//           setProgress(50);
//           const formattedData = formatData(jsonData);
//           setData(formattedData);
//           setProgress(75);
//           await sendDataToAPI(formattedData);
//           setProgress(100);
//         } catch (e) {
//           setError('Error parsing JSON file');
//           setProgress(0);
//         } finally {
//           setUploading(false);
//         }
//       };
//       reader.readAsText(file);
//     } else {
//       setError('No file selected');
//     }
//   };

//   const fieldMap = {
//     'Street Lights': ['city'],
//     'Industrial Site A': ['name', 'zip'],
//     'Housing Board': ['email', 'phone'],
//     'Hospitals': ['age', 'birthday']
//   };

//   const formatData = (data: any) => {
//     const fields = fieldMap[modelType];
//     const results: any = {};
//     fields.forEach((field: string) => {
//       const result = findField(data, field);
//       if (result) {
//         results[field] = result;
//       }
//     });
//     return results;
//   };

//   const findField = (obj: any, field: string): any => {
//     if (typeof obj !== 'object' || obj === null) return null;
//     if (obj.hasOwnProperty(field)) return obj[field];
//     for (let key in obj) {
//       if (obj.hasOwnProperty(key)) {
//         const result = findField(obj[key], field);
//         if (result) return result;
//       }
//     }
//     return null;
//   };

//   const sendDataToAPI = async (data: any) => {
//     try {
//       const response = await axios.post('https://example.com/api/upload', data);
//       console.log('Data sent successfully:', response.data);
//     } catch (error) {
//       console.error('Error sending data to API:', error);
//     }
//   };

//   const handleModelSelect = (eventKey: string | null, event: React.SyntheticEvent<unknown>) => {
//     const model = eventKey as keyof typeof fieldMap;
//     setModelType(model);
//   };

//   return (
//     <WidgetWrapper className="smart-city_box empty-box">
//       <div>
//         <div
//           style={{
//             position: 'fixed',
//             top: '20px',
//             right: '20px',
//             cursor: 'pointer',
//             zIndex: 1000
//           }}
//           onClick={() => setShowSGModal(true)}
//         >
//           <img src="https://static.iviva.com/images/Udhayimages/cloud-upload.png" alt="Upload Icon" width="32" height="32" />
//         </div>
//         <Modal className='json-uploader'
//           show={ShowSGModal} title='POI Controller'
//           onOpen={() => { }}
//           onClose={() => setShowSGModal(false)}
//         >
//           <WidgetWrapper className="smart-city_box ">
//             <div className="json-uploader-widget">
//               <h2>Upload JSON File</h2>
//               <DropdownButton
//                 id="dropdown-basic-button"
//                 title={`Model: ${modelType}`}
//                 onSelect={handleModelSelect}
//                 style={{ marginBottom: '10px' }}
//                 variant="success"
//               >
//                 <Dropdown.Item eventKey="Street Lights">Street Lights</Dropdown.Item>
//                 <Dropdown.Item eventKey="Industrial Site A">Industrial Site A</Dropdown.Item>
//                 <Dropdown.Item eventKey="Housing Board">Housing Board</Dropdown.Item>
//                 <Dropdown.Item eventKey="Hospitals">Hospitals</Dropdown.Item>
//               </DropdownButton>
//               <div
//                 onDrop={handleDrop}
//                 onDragOver={handleDragOver}
//                 onClick={() => document.getElementById('file-input').click()}
//                 style={{
//                   border: '2px dashed #3c763d',
//                   padding: '20px',
//                   borderRadius: '10px',
//                   textAlign: 'center',
//                   color: '#3c763d',
//                   marginBottom: '10px',
//                   cursor: 'pointer'
//                 }}
//               >
//                 {file ? file.name : 'Drag & drop a JSON file here, or click to select one'}
//                 <input
//                   id="file-input"
//                   type="file"
//                   accept=".json"
//                   onChange={handleFileChange}
//                   className="file-input"
//                   style={{ display: 'none' }}
//                 />
//               </div>
//               <Button onClick={handleFileUpload} disabled={uploading} className="upload-button">
//                 {uploading ? 'Uploading...' : 'Upload'}
//               </Button>
//               {error && <Alert variant="danger">{error}</Alert>}
//               {uploading && <ProgressBar animated now={progress} label={`${progress}%`} className="progress-bar" />}
//               {data && (
//                 <div className="data-preview">
//                   <h3>Parsed Data</h3>
//                   <pre>{JSON.stringify(data, null, 2)}</pre>
//                 </div>
//               )}
//             </div>
//           </WidgetWrapper>
//         </Modal>
//       </div>
//     </WidgetWrapper>
//   );
// };

// export default JsonUploader;



















// import React, { useState, useEffect } from 'react';
// import { WidgetWrapper, TitleBar , DropDownButton, Modal, FormField, Select, SearchBox , Button, Tooltip} from "uxp/components";
// import { IContextProvider } from '../uxp'; 
// import axios from 'axios';

// interface IMapChangeMode {
//   uxpContext: IContextProvider;
// } 

// const JsonUploader: React.FunctionComponent<IMapChangeMode> = (props) => {
//       const [file, setFile] = useState(null);
//       const [data, setData] = useState(null);
//       const [error, setError] = useState(null);
//       const [uploading, setUploading] = useState(false);
//       const [progress, setProgress] = useState(0);
//       const [modelType, setModelType] = useState('Street Lights');
//       const [showUploader, setShowUploader] = useState(false);

//       const handleFileChange = (event:any) => {
//         setFile(event.target.files[0]);
//         setError(null);
//       };

//       const handleDrop = (event:any) => {
//         event.preventDefault();
//         setFile(event.dataTransfer.files[0]);
//         setError(null);
//       };

//       const handleDragOver = (event:any) => {
//         event.preventDefault();
//       };

//       const handleFileUpload = async () => {
//         if (file) {
//           setUploading(true);
//           const reader = new FileReader();
//           reader.onload = async (event) => {
//             try {
//               setProgress(25);
//               const jsonData = JSON.parse(event.target.result);
//               setProgress(50);
//               const formattedData = formatData(jsonData);
//               setData(formattedData);
//               setProgress(75);
//               await sendDataToAPI(formattedData);
//               setProgress(100);
//             } catch (e) {
//               setError('Error parsing JSON file');
//               setProgress(0);
//             } finally {
//               setUploading(false);
//             }
//           };
//           reader.readAsText(file);
//         } else {
//           setError('No file selected');
//         }
//       };

//       const formatData = (data:any) => {
//         const fieldMap = {
//           'Street Lights': ['city'], //these are the POIs 
//           'Industrial Site A': ['name', 'zip'],
//           'Housing Board': ['email', 'phone'],
//           'Hospitals': ['age', 'birthday']
//         };
//         const fields = fieldMap[modelType];
//         const results = {};
//         fields.forEach((field: string | number) => {
//           const result = findField(data, field);
//           if (result) {
//             results[field] = result;
//           }
//         });
//         return results;
//       };

//       const findField = (obj: { [x: string]: any; hasOwnProperty: (arg0: string) => any; }, field: string | number) => {
//         if (typeof obj !== 'object' || obj === null) return null;
//         if (obj.hasOwnProperty(field)) return obj[field];
//         for (let key in obj) {
//           if (obj.hasOwnProperty(key)) {
//             const result = findField(obj[key], field);
//             if (result) return result;
//           }
//         }
//         return null;
//       };

//       const sendDataToAPI = async (data:any) => {
//         try {
//           const response = await axios.post('https://example.com/api/upload', data);
//           console.log('Data sent successfully:', response.data);
//         } catch (error) {
//           console.error('Error sending data to API:', error);
//         }
//       };

//       const handleModelSelect = (model:any) => {
//         setModelType(model);
//       };




// // Event handler function
// const handleItemClick = (event:any) => {
//   const eventKey = event.target.getAttribute('data-event-key');
//   // Handle the event key as needed
//   console.log(eventKey);
// };

      
  
//   return (
//     <WidgetWrapper className="smart-city_box empty-box"> 

// <div>
//       <div
//         style={{
//           position: 'fixed',
//           top: '20px',
//           right: '20px',
//           cursor: 'pointer',
//           zIndex: 1000
//         }}
//         onClick={() => setShowUploader(!showUploader)}
//       >
//         <img src="upload2.png" alt="Upload Icon" width="50" height="50" />
//       </div>

//       {showUploader && (
//         <div className="json-uploader">
//           <h2>Upload JSON File</h2>
        
        
//           {/* <DropdownButton
//             id="dropdown-basic-button"
//             title={`Model: ${modelType}`}
//             onSelect={handleModelSelect}
//             style={{ marginBottom: '10px' }}
//             variant="success"
//           >
//             <Dropdown.Item eventKey="Street Lights">Street Lights</Dropdown.Item>
//             <Dropdown.Item eventKey="Industrial Site A">Industrial Site A</Dropdown.Item>
//             <Dropdown.Item eventKey="Housing Board">Housing Board</Dropdown.Item>
//             <Dropdown.Item eventKey="Hospitals">Hospitals</Dropdown.Item>
//           </DropdownButton> */}

//                 <DropDownButton className="gear-dropdown"
//                     content={() => (
//                         <div className="gear-dropdown-cont">
//                             <ul>
//                                 <li className="sg-icon" data-event-key="Street Lights" onClick={handleItemClick}>
//                                     Street Lights
//                                 </li>
//                                 <li className="sg-icon" data-event-key="Industrial Site A" onClick={handleItemClick}>
//                                     Industrial Site A
//                                 </li>
//                                 <li className="sg-icon" data-event-key="Housing Board" onClick={handleItemClick}>
//                                     Housing Board
//                                 </li>
//                                 <li className="sg-icon" data-event-key="Hospitals" onClick={handleItemClick}>
//                                     Hospitals
//                                 </li>
//                             </ul>
//                         </div>
//                     )}
//                     position="left"
//                 >
//                 </DropDownButton>



//           <div
//             onDrop={handleDrop}
//             onDragOver={handleDragOver}
//             onClick={() => document.getElementById('file-input').click()}
//             style={{
//               border: '2px dashed #3c763d',
//               padding: '20px',
//               borderRadius: '10px',
//               textAlign: 'center',
//               color: '#3c763d',
//               marginBottom: '10px',
//               cursor: 'pointer'
//             }}
//           >
//             {file ? file.name : 'Drag & drop a JSON file here, or click to select one'}
//             <input
//               id="file-input"
//               type="file"
//               accept=".json"
//               onChange={handleFileChange}
//               className="file-input"
//               style={{ display: 'none' }}
//             />
//           </div>
//           <Button onClick={handleFileUpload} disabled={uploading} className="upload-button" title={''}>
//             {uploading ? 'Uploading...' : 'Upload'}
//           </Button>
//           {error && <Alert variant="danger">{error}</Alert>}
//           {uploading && <ProgressBar animated now={progress} label={`${progress}%`} className="progress-bar" />}
//           {data && (
//             <div className="data-preview">
//               <h3>Parsed Data</h3>
//               <pre>{JSON.stringify(data, null, 2)}</pre>
//             </div>
//           )}
//         </div>
//       )}
//     </div>

//     </WidgetWrapper> 
//   );
// };
// export default JsonUploader; 
 