// import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
// import { unmarshall } from "@aws-sdk/util-dynamodb";
// import { APIGatewayProxyEvent } from "aws-lambda";
// import { getPassword } from "../../src/services/passwordsHandlers/getPasswords";

// jest.mock("@aws-sdk/client-dynamodb");

// describe("getPassword", () => {
//   const ddbClientMock = new DynamoDBClient({});

//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

// //   it("should return password details when ID is provided", async () => {
// //     // Mocking GetItemCommand response
// //     (ddbClientMock.send as jest.Mock).mockResolvedValue({
// //       Item: {
// //         id: { S: "exampleId" },
// //         // Other attributes...
// //       },
// //     });

// //     const event: APIGatewayProxyEvent = {
// //       queryStringParameters: { id: "exampleId" },
// //     } as APIGatewayProxyEvent;

// //     const result = await getPassword(event, ddbClientMock);

// //     expect(result.statusCode).toBe(200);
// //     expect(JSON.parse(result.body)).toEqual({
// //       id: "exampleId", // Adjust based on your actual response structure
// //       // Other attributes...
// //     });
// //   });

// //   it("should return 404 when ID is not found", async () => {
// //     // Mocking GetItemCommand response when item is not found
// //     (ddbClientMock.send as jest.Mock).mockResolvedValue({});

// //     const event: APIGatewayProxyEvent = {
// //       queryStringParameters: { id: "nonexistentId" },
// //     } as APIGatewayProxyEvent;

// //     const result = await getPassword(event, ddbClientMock);

// //     expect(result.statusCode).toBe(404);
// //     expect(JSON.parse(result.body)).toBe(
// //       "Password with id nonexistentId not found"
// //     );
// //   });

//   it("should return 400 when no ID is provided", async () => {
//     const event: APIGatewayProxyEvent = {
//       queryStringParameters: {},
//     } as APIGatewayProxyEvent;

//     const result = await getPassword(event, ddbClientMock);

//     expect(result.statusCode).toBe(400);
//     expect(JSON.parse(result.body)).toBe("ID REQUIRED");
//   });

//   // Add more tests for other scenarios as needed
// });
