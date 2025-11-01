from locust import HttpUser, task, between


class StudentUser(HttpUser):
    """
    Simulates student users performing typical actions.
    Most users are students (~48 out of 50).
    """
    wait_time = between(1, 3)
    weight = 24

    def on_start(self):
        """Login as a student before running any tasks."""
        self.username = "523cs0009@iiitk.ac.in"
        self.password = "XBz2biTr"
        self.headers = {"Authorization": ""}

        with self.client.post(
            "/api/auth/token",
            data={"username": self.username, "password": self.password},
            catch_response=True,
        ) as response:
            if response.status_code == 200:
                token = response.json().get("access_token")
                if token:
                    self.headers["Authorization"] = f"Bearer {token}"
                response.success()
            else:
                response.failure(f"Login failed: {response.text}")

    @task(2)
    def get_profile(self):
        """Fetch the student's profile."""
        self.client.get("/profile/student/me", headers=self.headers)

    @task(1)
    def get_jobs(self):
        """Fetch the list of all jobs."""
        self.client.get("/api/jobs/get-jobs", headers=self.headers)


class AdminUser(HttpUser):
    """
    Simulates admin users performing administrative actions.
    Only a few users are admins (~2 out of 50).
    """
    wait_time = between(1, 5)
    weight = 1

    def on_start(self):
        """Login as an admin before running any tasks."""
        self.username = "admin"
        self.password = "admin"
        self.headers = {"Authorization": ""}

        with self.client.post(
            "/api/auth/token",
            data={"username": self.username, "password": self.password},
            catch_response=True,
        ) as response:
            if response.status_code == 200:
                token = response.json().get("access_token")
                if token:
                    self.headers["Authorization"] = f"Bearer {token}"
                response.success()
            else:
                response.failure(f"Login failed: {response.text}")

    @task(2)
    def get_all_jobs(self):
        """Fetch all jobs."""
        self.client.get("/api/jobs/get-jobs", headers=self.headers)

    @task(1)
    def get_master_sheets(self):
        """Fetch master sheets (admin only)."""
        self.client.get("/api/jobs/master-sheets", headers=self.headers)