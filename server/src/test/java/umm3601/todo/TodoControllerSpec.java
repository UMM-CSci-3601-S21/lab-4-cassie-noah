package umm3601.todo;

import static com.mongodb.client.model.Filters.eq;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.google.common.collect.ImmutableMap;
import com.mockrunner.mock.web.MockHttpServletRequest;
import com.mockrunner.mock.web.MockHttpServletResponse;
import com.mongodb.MongoClientSettings;
import com.mongodb.ServerAddress;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.NotFoundResponse;
import io.javalin.http.util.ContextUtil;
import io.javalin.plugin.json.JavalinJson;

/**
* Tests the logic of the TodoController
*
* @throws IOException
*/

public class TodoControllerSpec {

  MockHttpServletRequest mockReq = new MockHttpServletRequest();
  MockHttpServletResponse mockRes = new MockHttpServletResponse();

  private TodoController todoController;

  private ObjectId testId;

  static MongoClient mongoClient;
  static MongoDatabase db;

  static ObjectMapper jsonMapper = new ObjectMapper();

  @BeforeAll
  public static void setupAll(){
    String mongoAddr = System.getenv().getOrDefault("MONGO_ADDR", "localhost");

    mongoClient = MongoClients.create(
    MongoClientSettings.builder()
    .applyToClusterSettings(builder ->
    builder.hosts(Arrays.asList(new ServerAddress(mongoAddr))))
    .build());

    db = mongoClient.getDatabase("test");
  }

  @BeforeEach
  public void setupEach() throws IOException {

    // Reset our mock request and response objects
    mockReq.resetAll();
    mockRes.resetAll();

    // Setup database
    MongoCollection<Document> todoDocuments = db.getCollection("todos");
    todoDocuments.drop();
    List<Document> testTodos = new ArrayList<>();
    testTodos.add(
      new Document()
      .append("owner", "Fry")
      .append("category", "groceries")
      .append("body", "Nostrud ullamco labore exercitation magna. Excepteur aute aliqua veniam veniam nisi eu occaecat ea magna do.")
      .append("status", false));
    testTodos.add(
      new Document()
      .append("owner", "Mary")
      .append("category", "homework")
      .append("body", "Nostrud ullamco labore exercitation magna. Excepteur aute aliqua veniam veniam nisi eu occaecat ea magna do.")
      .append("status", false));
    testTodos.add(
      new Document()
      .append("owner", "Bob")
      .append("category", "groceries")
      .append("body", "Nostrud ullamco labore exercitation magna. Excepteur aute aliqua veniam veniam nisi eu occaecat ea magna do.")
      .append("status", true));

    testId = new ObjectId();
    Document Fry =
      new Document()
        .append("_id", testId)
        .append("owner", "Fry")
        .append("category", "homework")
        .append("body", "Nostrud ullamco labore exercitation magna. Excepteur aute aliqua veniam veniam nisi eu occaecat ea magna do.")
        .append("status", true);


    todoDocuments.insertMany(testTodos);
    todoDocuments.insertOne(Fry);

    todoController = new TodoController(db);
  }


  @Test
  public void GetAllTodos() throws IOException {

    // Create our fake Javalin context
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/todos");
    todoController.getTodos(ctx);


    assertEquals(200, mockRes.getStatus());

    String result = ctx.resultString();
    assertEquals(db.getCollection("todos").countDocuments(), JavalinJson.fromJson(result, Todo[].class).length);
  }

  @Test
  public void GetTodosByStatus() throws IOException {
    mockReq.setQueryString("status=false");

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/todos");
    todoController.getTodos(ctx);

    assertEquals(200, mockRes.getStatus());

    String result = ctx.resultString();
    Todo[] resultTodos = JavalinJson.fromJson(result, Todo[].class);

    // There should be two todos with a false status
    assertEquals(2, resultTodos.length);
    for(Todo todo : resultTodos){
      assertEquals(false, todo.status);
    }
  }

  @Test
  public void GetTodosByOwner(){
    mockReq.setQueryString("owner=Fry");

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/todos");
    todoController.getTodos(ctx);

    //assert that request went through
    assertEquals(200, mockRes.getStatus());

    String result = ctx.resultString();
    Todo[] resultTodos = JavalinJson.fromJson(result, Todo[].class);

    for(Todo todo : resultTodos){
      assertEquals("Fry", todo.owner, "The owner should be Fry");
    }
  }

  @Test
  public void GetTodosByBody(){
    mockReq.setQueryString("body=tempor");

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/todos");
    todoController.getTodos(ctx);

    assertEquals(200, mockRes.getStatus());

    String result = ctx.resultString();
    Todo[] resultTodos = JavalinJson.fromJson(result, Todo[].class);

    for(Todo todo : resultTodos){
      assertTrue(todo.body.contains("tempor"), "The body of the Todo should contain tempor");
    }
  }

  @Test
  public void GetTodosByCategory(){
    mockReq.setQueryString("category=groceries");

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/todos");
    todoController.getTodos(ctx);

    assertEquals(200, mockRes.getStatus());

    String result = ctx.resultString();
    Todo[] resultTodos = JavalinJson.fromJson(result, Todo[].class);
    assertEquals(2, resultTodos.length);
    for(Todo todo : resultTodos ){
      assertEquals("groceries", todo.category, "The category should be groceries");
    }
  }
 @Test
 public void GetTodoById(){
  String testID = testId.toHexString();

  Context ctx = ContextUtil.init(mockReq, mockRes, "api/todos/:id", ImmutableMap.of("id", testID));
  todoController.getTodo(ctx);

  assertEquals(200, mockRes.getStatus());

  String result = ctx.resultString();
  Todo resultTodo = JavalinJson.fromJson(result, Todo.class);

  assertEquals(testId.toHexString(), resultTodo._id.toString());
  assertEquals(resultTodo.owner, "Fry");
 }








}
