<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class TrialCollection extends ResourceCollection
{
    /**
     * The resource that this resource collects.
     *
     * @var string
     */
    public $collects = 'App\Http\Resources\TrialResource';

    /**
     * @var null
     */
    protected $message = null;

    /**
     * @param $message
     * @return $this
     */
    public function setMessage($message)
    {
        $this->message = $message;
        return $this;
    }

    /**
     * Transform the resource collection into an array.
     *
     * @param Request $request
     * @return array
     */
    public function toArray($request)
    {
        return parent::toArray($request);
        /*return $this->collection->map(function(TrialResource $resource) use($request){
            return $resource
                ->toArray($request);
        })->all();*/
    }

    /**
     * Get additional data that should be returned with the resource array.
     *
     * @param Request $request
     * @return array
     */
    public function with($request)
    {
        return [
            'success' => true,
            'message' => $this->message,
            'meta' => null,
            'errors' => null
        ];
    }
}
