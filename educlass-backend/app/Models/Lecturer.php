<?php

namespace App\Models;

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Lecturer extends Model
{
    /**
     * Get the courses taught by the lecturer.
     */
    public function courses(): HasMany
    {
        return $this->hasMany(Course::class);
    }
}
