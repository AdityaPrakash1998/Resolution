$(document).ready(function()
{
  $('.delete_resolution').on('click',function(e)
{
  $target=$(e.target);
  const id=$target.attr('data-id');
  $.ajax({
    type:'delete',
    url:'/resolution/'+id,
    success: function(response)
    {
      alert("Deleting this Resolution");
      window.location.href='/';
    },
    error: function(err)
    {
      console.log(err);
    }
  });

});

});

$(document).ready(function()
{
  $('.Logout').on('click',function(e)
  {
    $target=$(e.target);
    $.ajax({
      type:'POST',
      url:'/users/logout',
      success:function(response)
      {
        alert('You are being logged out');
        window.location.href='/users/login';
      },
      error:function(err)
      {
        console.log('err');
      }
    });
  });
});
