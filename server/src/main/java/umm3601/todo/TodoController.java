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

  static String emailRegex = "^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$";

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
    filters.add(eq(BODY_KEY, ctx.queryParam(BODY_KEY)));
  }
  if (ctx.queryParamMap().containsKey(CATEGORY_KEY)) {
    filters.add(regex(CATEGORY_KEY,  Pattern.quote(ctx.queryParam(CATEGORY_KEY)), "i"));
  }
  String sortBy = ctx.queryParam("sortby", "body"); //Sort by sort query param, default is body
  String sortOrder = ctx.queryParam("sortorder", "asc");

  ctx.json(todoCollection.find(filters.isEmpty() ? new Document() : and(filters))
    .sort(sortOrder.equals("desc") ?  Sorts.descending(sortBy) : Sorts.ascending(sortBy))
    .into(new ArrayList<>()));

}

}
