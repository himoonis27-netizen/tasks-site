import { badRequest, isAuthorized, json, supabase, unauthorized } from "./_shared";
  if (!isAuthorized(event)) {
    return unauthorized();
  }

  try {
    const id = event.queryStringParameters?.id || null;

    if (event.httpMethod === "GET") {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return json(200, data);
    }

    if (event.httpMethod === "POST") {
      const body = JSON.parse(event.body || "{}");
      const payload = {
        title: body.title?.trim() || "Без названия",
        content: body.content || "",
        tag: body.tag || "idea",
        favorite: !!body.favorite,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("notes")
        .insert(payload)
        .select()
        .single();

      if (error) throw error;
      return json(200, data);
    }

    if (event.httpMethod === "PATCH") {
      if (!id) return badRequest("Missing note id");

      const body = JSON.parse(event.body || "{}");
      const payload = {
        ...(body.title !== undefined ? { title: body.title } : {}),
        ...(body.content !== undefined ? { content: body.content } : {}),
        ...(body.tag !== undefined ? { tag: body.tag } : {}),
        ...(body.favorite !== undefined ? { favorite: !!body.favorite } : {}),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("notes")
        .update(payload)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return json(200, data);
    }

    if (event.httpMethod === "DELETE") {
      if (!id) return badRequest("Missing note id");

      const { error } = await supabase
        .from("notes")
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
