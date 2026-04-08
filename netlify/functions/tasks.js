import { badRequest, isAuthorized, json, supabase, unauthorized } from "./_shared";

export async function handler(event) {
  if (!isAuthorized(event)) {
    return unauthorized();
  }

  try {
    const id = event.queryStringParameters?.id || null;

    if (event.httpMethod === "GET") {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return json(200, data);
    }

    if (event.httpMethod === "POST") {
      const body = JSON.parse(event.body || "{}");
      const payload = {
        text: body.text?.trim() || "",
        done: !!body.done,
        priority: body.priority || "medium",
        due_date: body.due_date || null,
        updated_at: new Date().toISOString(),
      };

      if (!payload.text) return badRequest("Task text is required");

      const { data, error } = await supabase
        .from("tasks")
        .insert(payload)
        .select()
        .single();

      if (error) throw error;
      return json(200, data);
    }

    if (event.httpMethod === "PATCH") {
      if (!id) return badRequest("Missing task id");

      const body = JSON.parse(event.body || "{}");
      const payload = {
        ...(body.text !== undefined ? { text: body.text } : {}),
        ...(body.done !== undefined ? { done: !!body.done } : {}),
        ...(body.priority !== undefined ? { priority: body.priority } : {}),
        ...(body.due_date !== undefined ? { due_date: body.due_date || null } : {}),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("tasks")
        .update(payload)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return json(200, data);
    }

    if (event.httpMethod === "DELETE") {
      if (!id) return badRequest("Missing task id");

      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return json(200, { ok: true, id });
    }

    return json(405, { error: "Method not allowed" });
  } catch (error) {
    return json(500, { error: error.message || "Server error" });
  }
}
