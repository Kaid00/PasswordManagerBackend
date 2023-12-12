// import { monitorHandler } from "../../src/services/monitor/monitorHandler"




// describe('Monitor lambda test', () => {

//     const fetchSpy = jest.spyOn(global, 'fetch');
//     fetchSpy.mockImplementation(()=>Promise.resolve({} as any));

//     afterEach(() => {
//         jest.clearAllMocks()
//     })

//     test('makes request for records in SnsEvents',async ()=> {
//         await monitorHandler ({
//             Records: [{
//                 Sns: {
//                     Message: 'Test message'
//                 }
//             }]
//         } as any, {});

//         expect(fetchSpy).toHaveBeenCalledTimes(1);
//         expect(fetchSpy).toHaveBeenCalledWith(expect.any(String), {
//             method: 'POST',
//             body: JSON.stringify({
//                 "text": `Password manager API 4xx ALARM Test message`
//             })
//         });
//     })

//     test('No SNS records, no request made',async ()=> {
//         await monitorHandler ({
//             Records: []
//         } as any, {});

//         expect(fetchSpy).not.toHaveBeenCalled();
      
//     })
// })