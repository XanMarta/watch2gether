
function ProfileForm() {
  const style = {
    "padding-left": "3rem",
  }
  return (
    <>
      <div class="container">
        <div class="row mt-5">
          <div
            class="card card-inverse"
          ></div>
        </div>
        <div class="row">
          <div class="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12 border border-5">
            <div class="card-body">
              <div class="account-settings">
                <div class="user-profile">
                  <div class="user-avatar">
                    <img
                      src="https://bootdey.com/img/Content/avatar/avatar7.png"
                      alt="Maxwell Admin"
                      class="w-100 h-50;"
                    />
                  </div>
                  <h5 class="user-name text-center mt-3">
                    fsdafhasd
                  </h5>
                  <h6 class="user-email text-center mt-3">fhasdkfhs</h6>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xl-9 col-lg-9 col-md-12 col-sm-12 col-12 border border-5">
            <div class="row mb-1">
              <p class="fieldTitle">Tên đầy đủ</p>
            </div>
            <div class="row mb-1">
              <p class="fieldTitle">Ngày sinh:</p>
            </div>
            <div class="row mb-1">
              <p class="fieldTitle">Địa chỉ</p>
            </div>
            <div class="row mb-1">
              <p class="fieldTitle">Email</p>
            </div>
            <div class="row mb-1">
              <p class="fieldTitle">Số điện thoại:</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function Avatar() {
  return (
    <div class="pl-24 grid grid-cols-1 gap-4 place-content-start border-4 border-indigo-600/100">
      <div><img width="300" height="150" src="https://images.unsplash.com/photo-1615789591457-74a63395c990?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8YmFieSUyMGNhdHxlbnwwfHwwfHw%3D&w=1000&q=80"></img></div>
      <div><h1>MY username</h1></div>
      <div>03</div>
      <div>04</div>
    </div>
  );
}

export default ProfileForm;