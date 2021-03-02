package umm3601.todo;

import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Filters.regex;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import com.google.common.collect.ImmutableMap;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Sorts;

import org.bson.Document;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.mongojack.JacksonMongoCollection;

import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.NotFoundResponse;

/**
 * Controller that manages requests for info about Todos.
 */
public class TodoController {

  private static final String OWNER_KEY = "owner";
  private static final String CATEGORY_KEY = "category";
  private static final String BODY_KEY = "body";
  private static final String STATUS_KEY = "status";

  static String statusRegex = "^(false|False|True|true)$";

  private final JacksonMongoCollection<Todo> todoCollection;

  /**
   * Construct a controller for todos.
   *
   * @param database the database containing todo data
   */
  public TodoController(MongoDatabase database) {
    todoCollection = JacksonMongoCollection.builder().build(database, "todos", Todo.class);
  }

public void getTodos(Context ctx) {

  List<Bson> filters = new ArrayList<>(); // start with a blank document

  if (ctx.queryParamMap().containsKey(BODY_KEY)) {
    filters.add(regex(BODY_KEY,  Pattern.quote(ctx.queryParam(BODY_KEY)), "i"));
  }
  if (ctx.queryParamMap().containsKey(CATEGORY_KEY)) {
    filters.add(regex(CATEGORY_KEY,  Pattern.quote(ctx.queryParam(CATEGORY_KEY)), "i"));
  }
  if(ctx.queryParamMap().containsKey(STATUS_KEY)){
    boolean targetStatus = ctx.queryParam(STATUS_KEY, Boolean.class).get();
    filters.add(eq(STATUS_KEY, targetStatus));
  }
  if(ctx.queryParamMap().containsKey(OWNER_KEY)){
    filters.add(regex(OWNER_KEY,  Pattern.quote(ctx.queryParam(OWNER_KEY)), "i"));
  }
  String sortBy = ctx.queryParam("sortby", "body"); //Sort by sort query param, default is body
  String sortOrder = ctx.queryParam("sortorder", "asc");

  ctx.json(todoCollection.find(filters.isEmpty() ? new Document() : and(filters))
    .sort(sortOrder.equals("desc") ?  Sorts.descending(sortBy) : Sorts.ascending(sortBy))
    .into(new ArrayList<>()));

}

public void getTodo(Context ctx){
  String id = ctx.pathParam("id");
  Todo todo;

  try{
    todo = todoCollection.find(eq("_id", new ObjectId(id))).first();
  } catch(IllegalArgumentException e){
    throw new BadRequestResponse("The id is not valid");
  }
  if(todo == null){
    throw new NotFoundResponse("The todo could not be found");
  }
  else{
    ctx.json(todo);
  }

}

public void addNewTodo(Context ctx) {
  Todo newTodo = ctx.bodyValidator(Todo.class)
    .check(todo -> todo.owner != null && todo.owner.length() > 0)
    .check(todo -> todo.status.toString().matches(statusRegex))
    .check(todo -> todo.category != null && todo.category.length() > 0)
    .check(todo -> todo.body != null && todo.body.length() > 0)
    .get();


  todoCollection.insertOne(newTodo);
  ctx.status(201);
  ctx.json(ImmutableMap.of("id", newTodo._id));
}

@SuppressWarnings("lgtm[java/weak-cryptographic-algorithm]")
  public String md5(String str) throws NoSuchAlgorithmException {
    MessageDigest md = MessageDigest.getInstance("MD5");
    byte[] hashInBytes = md.digest(str.toLowerCase().getBytes(StandardCharsets.UTF_8));

    StringBuilder result = new StringBuilder();
    for (byte b : hashInBytes) {
      result.append(String.format("%02x", b));
    }
    return result.toString();
  }

}
