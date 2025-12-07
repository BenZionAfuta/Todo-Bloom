-- Fix tasks UPDATE policy - restrict to owners, assignees, or project members
DROP POLICY IF EXISTS "Users can update tasks" ON public.tasks;
CREATE POLICY "Users can update tasks" ON public.tasks
FOR UPDATE USING (
  auth.uid() = created_by OR 
  auth.uid() = assignee_id OR
  auth.uid() IN (SELECT user_id FROM project_members WHERE project_id = tasks.project_id)
);

-- Fix profiles SELECT policy - users can only see profiles of team members they share projects with
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can view project teammates" ON public.profiles
FOR SELECT USING (
  id IN (
    SELECT pm.user_id FROM project_members pm 
    WHERE pm.project_id IN (
      SELECT project_id FROM project_members WHERE user_id = auth.uid()
    )
  )
);

-- Fix project_members INSERT policy - only project owners or admins can add members
DROP POLICY IF EXISTS "Users can add project members" ON public.project_members;
CREATE POLICY "Project owners can add members" ON public.project_members
FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT created_by FROM projects WHERE id = project_id)
  OR public.has_role(auth.uid(), 'admin')
);

-- Fix project_members DELETE policy - only project owners or admins can remove members
DROP POLICY IF EXISTS "Users can remove project members" ON public.project_members;
CREATE POLICY "Project owners can remove members" ON public.project_members
FOR DELETE USING (
  auth.uid() IN (SELECT created_by FROM projects WHERE id = project_id)
  OR public.has_role(auth.uid(), 'admin')
);